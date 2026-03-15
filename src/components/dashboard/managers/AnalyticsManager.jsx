import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { initFirebase } from '../../../lib/firebase';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AnalyticsManager() {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0, today: 0, week: 0, month: 0,
        byDay: {}, byMonth: {}
    });

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [filterActive, setFilterActive] = useState(false);
    const [filterTrigger, setFilterTrigger] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        let unsubUpdates = () => { };
        let unsubVisits = () => { };

        const subscribeToVisits = async () => {
            setLoading(true);
            const { db } = await initFirebase();
            if (!db) return;

            let durationMap = {};

            // Subscribe to session updates
            const updatesQuery = query(collection(db, 'session_updates'));
            unsubUpdates = onSnapshot(updatesQuery, (snapshot) => {
                durationMap = {};
                snapshot.docs.forEach(d => {
                    const data = d.data();
                    if (data.visitorId) {
                        const existing = durationMap[data.visitorId] || 0;
                        durationMap[data.visitorId] = Math.max(existing, data.duration || 0);
                    }
                });

                // If visits are already loaded, trigger a re-merge
                setVisits(prevVisits => {
                    if (prevVisits.length === 0) return prevVisits;
                    return prevVisits.map(visit => ({
                        ...visit,
                        duration: durationMap[visit.id] || visit.duration || 0
                    }));
                });
            }, (error) => {
                console.error("Error subscribing to session updates:", error);
            });

            // Subscribe to visitors
            let baseQuery = collection(db, 'visitors');
            let qConstraints = [];

            if (filterActive && startDate && endDate) {
                // Ensure date string comparison works accurately
                const formatYMD = (d) => {
                    const tzOffset = d.getTimezoneOffset() * 60000;
                    return new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
                };
                qConstraints.push(where('timestamp', '>=', formatYMD(startDate) + 'T00:00:00'));
                qConstraints.push(where('timestamp', '<=', formatYMD(endDate) + 'T23:59:59.999Z'));
            }

            qConstraints.push(orderBy('timestamp', 'desc'));
            const visitsQuery = query(baseQuery, ...qConstraints);

            unsubVisits = onSnapshot(visitsQuery, (snapshot) => {
                const newVisits = snapshot.docs.map(d => {
                    const data = d.data();
                    return {
                        id: d.id,
                        ...data,
                        duration: durationMap[d.id] || data.duration || 0
                    };
                });
                setVisits(newVisits);
                setLoading(false);
            }, (error) => {
                console.error("Error subscribing to visitors:", error);
                setLoading(false);
            });
        };

        subscribeToVisits();

        return () => {
            unsubUpdates();
            unsubVisits();
        };
    }, [filterTrigger]);

    // Calculate stats whenever visits change
    useEffect(() => {
        if (visits.length === 0) {
            setStats({
                total: 0, today: 0, week: 0, month: 0,
                byDay: {}, byMonth: {}
            });
            return;
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const newStats = {
            total: visits.length,
            today: 0, week: 0, month: 0,
            byDay: {}, byMonth: {}
        };

        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            const key = date.toISOString().split('T')[0];
            newStats.byDay[key] = 0;
        }

        // Initialize all months of current year
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.forEach(month => newStats.byMonth[month] = 0);

        visits.forEach(visit => {
            if (!visit.timestamp) return;
            const visitDate = new Date(visit.timestamp);
            const visitDay = new Date(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDate());

            if (visitDay.getTime() === today.getTime()) newStats.today++;
            if (visitDay >= weekAgo) newStats.week++;
            if (visitDay >= monthStart) newStats.month++;

            // By day
            const dayKey = visit.timestamp.split('T')[0];
            if (newStats.byDay.hasOwnProperty(dayKey)) {
                newStats.byDay[dayKey]++;
            }

            // By month
            if (visitDate.getFullYear() === now.getFullYear()) {
                const monthKey = months[visitDate.getMonth()];
                newStats.byMonth[monthKey]++;
            }
        });

        setStats(newStats);
    }, [visits]);

    // Reset pagination to page 1 when data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [visits.length]);

    const getBrowserIcon = (browser) => {
        const icons = {
            'Chrome': 'fab fa-chrome text-green-400',
            'Firefox': 'fab fa-firefox-browser text-orange-500',
            'Safari': 'fab fa-safari text-blue-400',
            'Edge': 'fab fa-edge text-blue-500',
            'Opera': 'fab fa-opera text-red-500',
            'IE': 'fab fa-internet-explorer text-blue-300'
        };
        return icons[browser] || 'fas fa-globe text-text-muted';
    };

    const formatDuration = (seconds) => {
        if (!seconds || seconds === 0) return '-';
        if (seconds < 60) return `${seconds} s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins < 60) return secs > 0 ? `${mins}m ${secs} s` : `${mins} m`;
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return remainingMins > 0 ? `${hours}h ${remainingMins} m` : `${hours} h`;
    };

    const renderChart = (data, formatLabel) => {
        const values = Object.values(data);
        const maxValue = Math.max(...values, 1);

        return Object.entries(data).map(([key, count], idx) => {
            const height = Math.max((count / maxValue) * 100, 2);
            return (
                <div key={idx} className="flex-1 bg-gradient-to-t from-brand-light to-brand-dark rounded-t-sm relative transition-all duration-300 hover:opacity-80 hover:scale-y-105 origin-bottom cursor-pointer group" style={{ height: `${height}% ` }}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[11px] text-text-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-text-muted whitespace-nowrap">{formatLabel(key, idx)}</span>
                </div>
            );
        });
    };

    if (loading) {
        return <div className="p-8 text-center text-text-muted"><i className="fas fa-spinner fa-spin text-2xl"></i> Loading Analytics...</div>;
    }

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const totalPages = Math.ceil(visits.length / ITEMS_PER_PAGE) || 1;
    const paginatedVisits = visits.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col gap-6 w-full animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <h3 className="text-xl font-bold text-white tracking-wide">Visitor Analytics</h3>

                {/* Date Filter Controls */}
                <div className="flex flex-wrap items-center gap-3">
                    <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => setDateRange(update)}
                        isClearable={false}
                        placeholderText="Select Date Range"
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-light transition-colors min-w-[220px]"
                        dateFormat="yyyy-MM-dd"
                    />
                    <button
                        onClick={() => {
                            if (startDate && endDate) {
                                setFilterActive(true);
                                setFilterTrigger(prev => prev + 1);
                            } else {
                                Swal.fire({ icon: 'warning', title: 'Missing Dates', text: 'Please select both a start and end date in the calendar to apply the filter.', background: '#1a1a1a', color: '#fff' });
                            }
                        }}
                        className="px-4 py-2 bg-brand-light/20 text-brand-light border border-brand-light/30 rounded-lg text-sm font-medium hover:bg-brand-light hover:text-white transition-all shadow-[0_4px_15px_rgba(33,150,243,0.15)] hover:shadow-[0_4px_20px_rgba(33,150,243,0.4)] ml-1">
                        Filter
                    </button>
                    {(filterActive || startDate || endDate) && (
                        <button
                            onClick={() => {
                                setDateRange([null, null]);
                                setFilterActive(false);
                                setFilterTrigger(prev => prev + 1);
                            }}
                            className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-all">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-black/20 border border-white/10 rounded-2xl p-5 sm:p-6 flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="w-14 h-14 rounded-xl relative flex items-center justify-center overflow-hidden shrink-0 shadow-[0_4px_15px_rgba(33,150,243,0.3)] bg-gradient-to-br from-[#1a2980] to-[#26d0ce]">
                        <i className="fas fa-eye text-2xl text-white relative z-10"></i>
                    </div>
                    <div>
                        <span className="block text-[28px] font-bold text-white mb-1 tracking-tight leading-none">{stats.total.toLocaleString()}</span>
                        <span className="text-[13px] text-text-muted font-medium uppercase tracking-wider">Total Visits</span>
                    </div>
                </div>
                <div className="bg-black/20 border border-white/10 rounded-2xl p-5 sm:p-6 flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="w-14 h-14 rounded-xl relative flex items-center justify-center overflow-hidden shrink-0 shadow-[0_4px_15px_rgba(33,150,243,0.3)] bg-gradient-to-br from-[#1a2980] to-[#26d0ce]">
                        <i className="fas fa-calendar-day text-2xl text-white relative z-10"></i>
                    </div>
                    <div>
                        <span className="block text-[28px] font-bold text-white mb-1 tracking-tight leading-none">{stats.today.toLocaleString()}</span>
                        <span className="text-[13px] text-text-muted font-medium uppercase tracking-wider">Today</span>
                    </div>
                </div>
                <div className="bg-black/20 border border-white/10 rounded-2xl p-5 sm:p-6 flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="w-14 h-14 rounded-xl relative flex items-center justify-center overflow-hidden shrink-0 shadow-[0_4px_15px_rgba(33,150,243,0.3)] bg-gradient-to-br from-[#1a2980] to-[#26d0ce]">
                        <i className="fas fa-calendar-week text-2xl text-white relative z-10"></i>
                    </div>
                    <div>
                        <span className="block text-[28px] font-bold text-white mb-1 tracking-tight leading-none">{stats.week.toLocaleString()}</span>
                        <span className="text-[13px] text-text-muted font-medium uppercase tracking-wider">This Week</span>
                    </div>
                </div>
                <div className="bg-black/20 border border-white/10 rounded-2xl p-5 sm:p-6 flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="w-14 h-14 rounded-xl relative flex items-center justify-center overflow-hidden shrink-0 shadow-[0_4px_15px_rgba(33,150,243,0.3)] bg-gradient-to-br from-[#1a2980] to-[#26d0ce]">
                        <i className="fas fa-calendar-alt text-2xl text-white relative z-10"></i>
                    </div>
                    <div>
                        <span className="block text-[28px] font-bold text-white mb-1 tracking-tight leading-none">{stats.month.toLocaleString()}</span>
                        <span className="text-[13px] text-text-muted font-medium uppercase tracking-wider">This Month</span>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-full overflow-hidden">
                <div className="bg-black/20 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-[18px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-dark mb-4 drop-shadow-sm">Visits by Day (Last 7 Days)</h3>
                    <div className="h-[200px] flex items-end gap-2 py-8 overflow-visible px-2 border-b border-l border-white/10 ml-4 relative">
                        {renderChart(stats.byDay, (key) => {
                            const d = new Date(key);
                            // Adjust for local timezone issues by appending T12:00:00 if needed, but original uses key directly
                            return daysOfWeek[new Date(key + 'T12:00:00').getDay()] || key.split('-').pop();
                        })}
                    </div>
                </div>
                <div className="bg-black/20 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-[18px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-dark mb-4 drop-shadow-sm">Visits by Month (This Year)</h3>
                    <div className="h-[200px] flex items-end gap-2 py-8 overflow-visible px-2 border-b border-l border-white/10 ml-4 relative">
                        {renderChart(stats.byMonth, (key) => key)}
                    </div>
                </div>
            </div>

            {/* Recent Visits Table */}
            <div className="bg-black/20 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl w-full max-w-full overflow-hidden">
                <h3 className="text-[18px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-dark mb-5 drop-shadow-sm">Recent Visitors</h3>
                <div className="overflow-x-auto w-full pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="py-3 px-4 text-left text-[13px] font-semibold text-text-secondary uppercase tracking-[0.5px]">Date & Time</th>
                                <th className="py-3 px-4 text-left text-[13px] font-semibold text-text-secondary uppercase tracking-[0.5px]">Duration</th>
                                <th className="py-3 px-4 text-left text-[13px] font-semibold text-text-secondary uppercase tracking-[0.5px]">Browser</th>
                                <th className="py-3 px-4 text-left text-[13px] font-semibold text-text-secondary uppercase tracking-[0.5px]">IP Address</th>
                                <th className="py-3 px-4 text-left text-[13px] font-semibold text-text-secondary uppercase tracking-[0.5px]">Location</th>
                                <th className="py-3 px-4 text-left text-[13px] font-semibold text-text-secondary uppercase tracking-[0.5px]">ISP / Org</th>
                                <th className="py-3 px-4 text-left text-[13px] font-semibold text-text-secondary uppercase tracking-[0.5px]">Referrer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedVisits.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-6 text-center text-text-muted border-b border-white/10">No visits recorded yet</td>
                                </tr>
                            ) : (
                                paginatedVisits.map((visit) => {
                                    const date = new Date(visit.timestamp);
                                    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                                    const referrer = !visit.referrer || visit.referrer === 'Direct' ? 'Direct' :
                                        visit.referrer.length > 30 ? visit.referrer.substring(0, 30) + '...' :
                                            visit.referrer;
                                    const browser = visit.browser || 'Unknown';
                                    const ip = visit.ip || 'Unknown';
                                    const location = visit.city && visit.country && visit.city !== 'Unknown'
                                        ? `${visit.city}, ${visit.country} `
                                        : visit.country || 'Unknown';
                                    const orgRaw = visit.org || visit.isp || 'Unknown';
                                    const ispOrg = (visit.isp && visit.isp !== 'Unknown')
                                        ? (visit.org && visit.org !== visit.isp ? `${visit.isp} (${visit.org})` : visit.isp)
                                        : orgRaw;
                                    const shortIsp = ispOrg.length > 25 ? ispOrg.substring(0, 25) + '...' : ispOrg;
                                    const duration = formatDuration(visit.duration || 0);

                                    return (
                                        <tr key={visit.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="py-3 px-4 text-[14px] text-white whitespace-nowrap">{formattedDate}</td>
                                            <td className="py-3 px-4 text-[14px] text-white whitespace-nowrap"><i className="fas fa-clock text-text-muted mr-1.5 group-hover:text-brand-light transition-colors"></i> {duration}</td>
                                            <td className="py-3 px-4 text-[14px] text-white whitespace-nowrap"><i className={`${getBrowserIcon(browser)} mr-1.5`}></i> {browser}</td>
                                            <td className="py-3 px-4 text-[14px] text-white"><code className="bg-black/30 px-2 py-0.5 rounded text-[13px] tracking-wider font-mono text-brand-light/90 border border-white/5">{ip}</code></td>
                                            <td className="py-3 px-4 text-[14px] text-white whitespace-nowrap"><i className="fas fa-map-marker-alt text-red-400 mr-1.5"></i> {location}</td>
                                            <td className="py-3 px-4 text-[14px] text-white whitespace-nowrap"><i className="fas fa-building text-blue-300 mr-1.5"></i> {shortIsp}</td>
                                            <td className="py-3 px-4 text-[14px] text-white truncate max-w-[200px]" title={visit.referrer}>{referrer}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-white/10 px-2 gap-4">
                        <span className="text-[13px] text-text-muted">
                            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, visits.length)} of {visits.length} entries
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-[13px] font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                            >
                                <i className="fas fa-chevron-left mr-1.5"></i> Previous
                            </button>
                            <div className="flex items-center justify-center min-w-[30px] h-[30px] rounded bg-brand-light/20 text-brand-light font-bold text-[13px]">
                                {currentPage}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-[13px] font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                            >
                                Next <i className="fas fa-chevron-right ml-1.5"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
