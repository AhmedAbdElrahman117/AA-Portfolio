// src/lib/utils.js

export function getBrowserName(userAgent) {
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Edg")) return "Edge";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    return "Unknown Browser";
}

export async function getVisitorGeoData() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('https://ipapi.co/json/', {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        return {
            ip: data.ip || 'Unknown',
            country: data.country_name || 'Unknown',
            city: data.city || 'Unknown',
            region: data.region || 'Unknown',
            deviceType: /Mobile|Android|iP(ad|hone|od)/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
            browser: getBrowserName(navigator.userAgent),
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.warn("Could not fetch precise geo data, falling back to basic metrics.");
        return {
            ip: 'Unknown',
            country: 'Unknown',
            city: 'Unknown',
            region: 'Unknown',
            deviceType: /Mobile|Android|iP(ad|hone|od)/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
            browser: getBrowserName(navigator.userAgent),
            timestamp: new Date().toISOString()
        };
    }
}

export async function recordVisitor() {
    try {
        const { getFirestore, collection, addDoc, Timestamp } = await import('firebase/firestore');
        const { initFirebase } = await import('./firebase');

        const { db } = await initFirebase();
        if (!db) return;

        // Prevent recording on localhost or dashboard
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return;
        }

        if (window.location.pathname.includes('/dashboard')) {
            return;
        }

        const sessionKey = 'aa_portfolio_session_recorded';
        if (sessionStorage.getItem(sessionKey)) {
            return; // Already recorded this session
        }

        const geoData = await getVisitorGeoData();

        const visitorData = {
            ...geoData,
            timestamp: Timestamp.now(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct'
        };

        const visitorsRef = collection(db, 'analytics_visitors');
        await addDoc(visitorsRef, visitorData);
        sessionStorage.setItem(sessionKey, 'true');

    } catch (error) {
        console.error("Error recording visitor:", error);
    }
}

let sessionStartTime = null;
let sessionActive = false;
let visibilityChanges = 0;
let lastInteractionTime = Date.now();
const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function setupSessionDurationTracking() {
    sessionStartTime = Date.now();
    sessionActive = true;
    lastInteractionTime = sessionStartTime;
    const sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + sessionStartTime;

    function resetIdleTimer() {
        lastInteractionTime = Date.now();
    }

    const interactionEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    interactionEvents.forEach(event => {
        window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    document.addEventListener('visibilitychange', () => {
        visibilityChanges++;
        resetIdleTimer();
    });

    function sendDuration() {
        if (!sessionActive) return;

        const now = Date.now();
        let duration = now - sessionStartTime;

        if (now - lastInteractionTime > IDLE_TIMEOUT) {
            duration -= (now - lastInteractionTime - IDLE_TIMEOUT);
        }

        if (duration < 5000) return; // Ignore less than 5 seconds

        const durationSeconds = Math.floor(duration / 1000);

        const dbId = "portfolio-e911a";
        const url = `https://firestore.googleapis.com/v1/projects/${dbId}/databases/(default)/documents/analytics_sessions`;

        const payload = {
            fields: {
                sessionId: { stringValue: sessionId },
                durationSeconds: { integerValue: durationSeconds },
                timestamp: { timestampValue: new Date().toISOString() },
                visibilityChanges: { integerValue: visibilityChanges },
                deviceType: { stringValue: /Mobile|Android|iP(ad|hone|od)/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop' },
                source: { stringValue: 'public_portfolio' }
            }
        };

        // Use sendBeacon for reliable delivery when closing tab
        if (navigator.sendBeacon) {
            navigator.sendBeacon(url, JSON.stringify(payload));
        } else {
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
                keepalive: true,
                headers: { 'Content-Type': 'application/json' }
            }).catch(console.error);
        }
    }

    // Send duration when user leaves
    window.addEventListener('beforeunload', sendDuration);

    // Also dispatch on pagehide (mobile)
    window.addEventListener('pagehide', sendDuration);
}
