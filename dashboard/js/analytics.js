/* ====================================
   AA Portfolio Dashboard - Analytics
   Fetches visitor data from Firebase
   ==================================== */

'use strict';

const Analytics = {
    db: null,
    firestoreMethods: null,
    visits: [],
    
    // Firebase configuration (loaded from config.js)
    firebase: window.CONFIG ? window.CONFIG.firebase : {
        apiKey: "AIzaSyC1Hr7L6yp27w6E9wInccgpPFMSSrBRvwE",
        authDomain: "portfolio-e911a.firebaseapp.com",
        projectId: "portfolio-e911a",
        storageBucket: "portfolio-e911a.firebasestorage.app",
        messagingSenderId: "16738302709",
        appId: "1:16738302709:web:3a17868a9bbfa3ba0563bc",
        measurementId: "G-4HJNGVNDS5"
    },
    
    // Initialize Firebase
    async initFirebase() {
        if (this.db) return;
        
        try {
            const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getFirestore, collection, getDocs, query, orderBy, limit, deleteDoc, doc, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            // Check if app already initialized
            const apps = getApps();
            const app = apps.length ? apps[0] : initializeApp(this.firebase);
            
            this.db = getFirestore(app);
            this.firestoreMethods = { collection, getDocs, query, orderBy, limit, deleteDoc, doc, onSnapshot };
        } catch (error) {
            throw error;
        }
    },
    
    // Unsubscribe functions for real-time listeners
    unsubscribers: [],
    
    // Subscribe to real-time updates
    async subscribeToVisits() {
        try {
            await this.initFirebase();
            const { collection, query, orderBy, onSnapshot } = this.firestoreMethods;
            
            // Build duration map from session updates (updated in real-time)
            let durationMap = {};
            
            // Subscribe to session updates
            const updatesQuery = query(collection(this.db, 'session_updates'));
            const unsubUpdates = onSnapshot(updatesQuery, (snapshot) => {
                durationMap = {};
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.visitorId) {
                        const existing = durationMap[data.visitorId] || 0;
                        durationMap[data.visitorId] = Math.max(existing, data.duration || 0);
                    }
                });
                // Re-merge durations when updates change
                this.mergeDurations(durationMap);
            });
            this.unsubscribers.push(unsubUpdates);
            
            // Subscribe to visitors
            const visitsQuery = query(collection(this.db, 'visitors'), orderBy('timestamp', 'desc'));
            const unsubVisits = onSnapshot(visitsQuery, (snapshot) => {
                this.visits = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        duration: durationMap[doc.id] || data.duration || 0
                    };
                });
                // Update UI with new data
                this.updateStatsUI();
            });
            this.unsubscribers.push(unsubVisits);
            
        } catch (error) {
            // Failed to subscribe - silent error handling
        }
    },
    
    // Merge durations into current visits
    mergeDurations(durationMap) {
        if (!this.visits.length) return;
        this.visits = this.visits.map(visit => ({
            ...visit,
            duration: durationMap[visit.id] || visit.duration || 0
        }));
        this.updateStatsUI();
    },
    
    // Update UI with current data
    updateStatsUI() {
        const stats = this.getStats();
        
        // Update stat cards
        const totalEl = document.getElementById('totalVisits');
        const todayEl = document.getElementById('todayVisits');
        const weekEl = document.getElementById('weekVisits');
        const monthEl = document.getElementById('monthVisits');
        
        if (totalEl) totalEl.textContent = stats.total.toLocaleString();
        if (todayEl) todayEl.textContent = stats.today.toLocaleString();
        if (weekEl) weekEl.textContent = stats.week.toLocaleString();
        if (monthEl) monthEl.textContent = stats.month.toLocaleString();
        
        // Render charts
        this.renderDailyChart(stats.byDay);
        this.renderMonthlyChart(stats.byMonth);
        this.renderRecentVisits(stats.recent);
    },
    
    // Unsubscribe from all listeners
    unsubscribeAll() {
        this.unsubscribers.forEach(unsub => unsub());
        this.unsubscribers = [];
    },
    
    // Fetch visits from Firebase (one-time, kept for compatibility)
    async fetchVisits() {
        try {
            await this.initFirebase();
            const { collection, getDocs, query, orderBy } = this.firestoreMethods;
            
            // Fetch visits and session updates in parallel
            const visitsQuery = query(collection(this.db, 'visitors'), orderBy('timestamp', 'desc'));
            const updatesQuery = query(collection(this.db, 'session_updates'));
            
            const [visitsSnapshot, updatesSnapshot] = await Promise.all([
                getDocs(visitsQuery),
                getDocs(updatesQuery)
            ]);
            
            // Build duration map from session updates
            const durationMap = {};
            updatesSnapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.visitorId) {
                    // Keep the latest/longest duration for each visitor
                    const existing = durationMap[data.visitorId] || 0;
                    durationMap[data.visitorId] = Math.max(existing, data.duration || 0);
                }
            });
            
            // Merge durations into visits
            this.visits = visitsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    duration: durationMap[doc.id] || data.duration || 0
                };
            });
            
            return this.visits;
        } catch (error) {
            return [];
        }
    },
    
    // Get statistics from cached visits
    getStats() {
        const visits = this.visits;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const stats = {
            total: visits.length,
            today: 0,
            week: 0,
            month: 0,
            byDay: {},
            byMonth: {},
            recent: []
        };
        
        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            const key = date.toISOString().split('T')[0];
            stats.byDay[key] = 0;
        }
        
        // Initialize all months of current year
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.forEach(month => {
            stats.byMonth[month] = 0;
        });
        
        // Process visits
        visits.forEach(visit => {
            const visitDate = new Date(visit.timestamp);
            const visitDay = new Date(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDate());
            
            if (visitDay.getTime() === today.getTime()) {
                stats.today++;
            }
            
            if (visitDay >= weekAgo) {
                stats.week++;
            }
            
            if (visitDay >= monthStart) {
                stats.month++;
            }
            
            // By day (last 7 days)
            const dayKey = visit.timestamp.split('T')[0];
            if (stats.byDay.hasOwnProperty(dayKey)) {
                stats.byDay[dayKey]++;
            }
            
            // By month (current year)
            if (visitDate.getFullYear() === now.getFullYear()) {
                const monthKey = months[visitDate.getMonth()];
                stats.byMonth[monthKey]++;
            }
        });
        
        // Get recent visits (first 20 since already sorted desc)
        stats.recent = visits.slice(0, 20);
        
        return stats;
    },
    
    // Render stats in dashboard
    async renderStats() {
        // Show loading state
        const cards = ['totalVisits', 'todayVisits', 'weekVisits', 'monthVisits'];
        cards.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '...';
        });
        
        // Subscribe to real-time updates
        await this.subscribeToVisits();
    },
    
    // Render daily chart
    renderDailyChart(data) {
        const container = document.getElementById('dailyChart');
        if (!container) return;
        
        const values = Object.values(data);
        const maxValue = Math.max(...values, 1);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        container.innerHTML = Object.entries(data).map(([date, count]) => {
            const height = (count / maxValue) * 100;
            const d = new Date(date);
            const dayName = days[d.getDay()];
            return `
                <div class="chart-bar" 
                     style="height: ${Math.max(height, 2)}%" 
                     data-value="${count}"
                     data-label="${dayName}">
                </div>
            `;
        }).join('');
    },
    
    // Render monthly chart
    renderMonthlyChart(data) {
        const container = document.getElementById('monthlyChart');
        if (!container) return;
        
        const values = Object.values(data);
        const maxValue = Math.max(...values, 1);
        
        container.innerHTML = Object.entries(data).map(([month, count]) => {
            const height = (count / maxValue) * 100;
            return `
                <div class="chart-bar" 
                     style="height: ${Math.max(height, 2)}%" 
                     data-value="${count}"
                     data-label="${month}">
                </div>
            `;
        }).join('');
    },
    
    // Render recent visits table
    renderRecentVisits(visits) {
        const tbody = document.getElementById('recentVisitsTable');
        if (!tbody) return;
        
        if (visits.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted);">
                        No visits recorded yet
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = visits.map(visit => {
            const date = new Date(visit.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            const referrer = visit.referrer === '' || visit.referrer === 'Direct' ? 'Direct' : 
                             visit.referrer.length > 30 ? visit.referrer.substring(0, 30) + '...' : 
                             visit.referrer;
            const browser = visit.browser || 'Unknown';
            const ip = visit.ip || 'Unknown';
            const location = visit.city && visit.country && visit.city !== 'Unknown' 
                ? `${visit.city}, ${visit.country}` 
                : visit.country || 'Unknown';
            const ispOrg = visit.isp && visit.isp !== 'Unknown' 
                ? (visit.org && visit.org !== visit.isp ? `${visit.isp} (${visit.org})` : visit.isp)
                : visit.org || 'Unknown';
            const duration = this.formatDuration(visit.duration || 0);
            return `
                <tr>
                    <td>${formattedDate}</td>
                    <td><i class="fas fa-clock"></i> ${duration}</td>
                    <td><i class="${this.getBrowserIcon(browser)}"></i> ${browser}</td>
                    <td><code>${ip}</code></td>
                    <td><i class="fas fa-map-marker-alt"></i> ${location}</td>
                    <td><i class="fas fa-building"></i> ${ispOrg.length > 25 ? ispOrg.substring(0, 25) + '...' : ispOrg}</td>
                    <td>${referrer}</td>
                </tr>
            `;
        }).join('');
    },
    
    // Get browser icon class
    getBrowserIcon(browser) {
        const icons = {
            'Chrome': 'fab fa-chrome',
            'Firefox': 'fab fa-firefox-browser',
            'Safari': 'fab fa-safari',
            'Edge': 'fab fa-edge',
            'Opera': 'fab fa-opera',
            'IE': 'fab fa-internet-explorer'
        };
        return icons[browser] || 'fas fa-globe';
    },
    
    // Format duration in seconds to human readable
    formatDuration(seconds) {
        if (!seconds || seconds === 0) return '-';
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
    },
    
    // Clear all analytics data from Firebase
    async clearData() {
        if (!confirm('Are you sure you want to delete all analytics data? This cannot be undone.')) {
            return;
        }
        
        try {
            await this.initFirebase();
            const { collection, getDocs, deleteDoc, doc } = this.firestoreMethods;
            
            // Delete visitors and session_updates in parallel
            const [visitorsSnapshot, updatesSnapshot] = await Promise.all([
                getDocs(collection(this.db, 'visitors')),
                getDocs(collection(this.db, 'session_updates'))
            ]);
            
            const deletePromises = [
                ...visitorsSnapshot.docs.map(d => deleteDoc(doc(this.db, 'visitors', d.id))),
                ...updatesSnapshot.docs.map(d => deleteDoc(doc(this.db, 'session_updates', d.id)))
            ];
            await Promise.all(deletePromises);
            
            this.visits = [];
            this.renderStats();
            
            if (typeof Dashboard !== 'undefined') {
                Dashboard.showToast('Analytics data cleared', 'success');
            }
        } catch (error) {
            if (typeof Dashboard !== 'undefined') {
                Dashboard.showToast('Failed to clear data: ' + error.message, 'error');
            }
        }
    }
};

// Make Analytics available globally
window.Analytics = Analytics;
