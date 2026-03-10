/**
 * Enhanced Dashboard with Error Handling for Finance Committee Platform
 * Uses centralized API client with proper error handling and user feedback.
 */

import { apiMethods, apiUtils } from './api.js';
import { ChartUtils } from './charts.js';

class DashboardManager {
    constructor() {
        this.charts = new Map();
        this.isLoading = false;
        this.init();
    }

    async init() {
        try {
            apiUtils.setLoading(true);
            await this.loadDashboardData();
            await this.initializeCharts();
            this.setupEventListeners();
        } catch (error) {
            console.error('Dashboard initialization failed:', error);
            apiUtils.showError(error, 'dashboard-error');
        } finally {
            apiUtils.setLoading(false);
        }
    }

    async loadDashboardData() {
        try {
            this.analyticsData = await apiMethods.analytics.getDashboard();
            
            if (!this.analyticsData) {
                throw new Error('No analytics data available');
            }

            this.updateStatCards();
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            apiUtils.showError(error, 'analytics-error');
            
            // Load comprehensive demo data for presentation
            this.analyticsData = this.getDemoAnalyticsData();
            console.log('Loaded demo analytics data');
            this.updateStatCards();
        }
    }
    
    getDemoAnalyticsData() {
        return {
            financial: {
                total_budget: 1250000,
                total_revenue: 1850000,
                total_sponsor_investment: 6800000,
                profit: 600000
            },
            monthly_trends: [
                { month: '2024-01', total_revenue: 120000, total_budget: 100000, total_sponsorship: 450000 },
                { month: '2024-02', total_revenue: 95000, total_budget: 85000, total_sponsorship: 380000 },
                { month: '2024-03', total_revenue: 180000, total_budget: 120000, total_sponsorship: 520000 },
                { month: '2024-04', total_revenue: 85000, total_budget: 70000, total_sponsorship: 320000 },
                { month: '2024-05', total_revenue: 220000, total_budget: 180000, total_sponsorship: 680000 },
                { month: '2024-06', total_revenue: 160000, total_budget: 140000, total_sponsorship: 480000 },
                { month: '2024-07', total_revenue: 195000, total_budget: 165000, total_sponsorship: 590000 },
                { month: '2024-08', total_revenue: 140000, total_budget: 125000, total_sponsorship: 410000 },
                { month: '2024-09', total_revenue: 210000, total_budget: 175000, total_sponsorship: 620000 },
                { month: '2024-10', total_revenue: 175000, total_budget: 150000, total_sponsorship: 540000 },
                { month: '2024-11', total_revenue: 190000, total_budget: 160000, total_sponsorship: 570000 },
                { month: '2024-12', total_revenue: 245000, total_budget: 200000, total_sponsorship: 720000 }
            ],
            sponsor_roi: [
                { sponsor_name: 'TechVision Solutions', total_investment: 500000, average_roi: 85 },
                { sponsor_name: 'Global Finance Corp', total_investment: 750000, average_roi: 92 },
                { sponsor_name: 'MediCare Plus', total_investment: 450000, average_roi: 78 },
                { sponsor_name: 'EduTech Innovations', total_investment: 350000, average_roi: 88 },
                { sponsor_name: 'RetailMax Enterprises', total_investment: 280000, average_roi: 95 },
                { sponsor_name: 'CloudNet Systems', total_investment: 600000, average_roi: 82 },
                { sponsor_name: 'BioPharm Research', total_investment: 850000, average_roi: 91 },
                { sponsor_name: 'FinEdge Analytics', total_investment: 420000, average_roi: 87 },
                { sponsor_name: 'SmartLearn Academy', total_investment: 180000, average_roi: 93 },
                { sponsor_name: 'StyleHub Fashion', total_investment: 320000, average_roi: 96 }
            ],
            industry_distribution: [
                { industry: 'Technology', count: 5 },
                { industry: 'Finance', count: 4 },
                { industry: 'Healthcare', count: 3 },
                { industry: 'Education', count: 4 },
                { industry: 'Retail', count: 3 },
                { industry: 'Other', count: 2 }
            ],
            event_performance: [
                { name: 'TechFest 2024', revenue: 75000, budget: 50000 },
                { name: 'Cultural Mela', revenue: 95000, budget: 80000 },
                { name: 'AI & ML Summit', revenue: 88000, budget: 65000 },
                { name: 'Sports Championship', revenue: 52000, budget: 45000 },
                { name: 'Career Fair 2024', revenue: 55000, budget: 40000 },
                { name: 'Alumni Meet 2024', revenue: 72000, budget: 60000 },
                { name: 'Innovation Expo 2025', revenue: 85000, budget: 70000 },
                { name: 'Music Festival', revenue: 68000, budget: 55000 }
            ]
        };
    }

    updateStatCards() {
        try {
            const financial = this.analyticsData.financial || {};
            // Animate numbers with error handling
            this.animateValue('revenue', 0, financial.total_revenue || 0, 1500);
            this.animateValue('investment', 0, financial.total_sponsor_investment || 0, 1500);
            this.animateValue('profit', 0, financial.profit || 0, 1500);
        } catch (error) {
            console.error('Failed to update stat cards:', error);
            // Fallback to direct text update
            const financial = this.analyticsData.financial || {};
            document.getElementById('revenue').textContent = apiUtils.formatCurrency(financial.total_revenue || 0);
            document.getElementById('investment').textContent = apiUtils.formatCurrency(financial.total_sponsor_investment || 0);
            document.getElementById('profit').textContent = apiUtils.formatCurrency(financial.profit || 0);
        }
    }

    animateValue(elementId, start, end, duration) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with ID '${elementId}' not found`);
            return;
        }

        const startTime = performance.now();
        const isRupee = element.textContent && element.textContent.includes('₹');
        
        const update = (currentTime) => {
            try {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth deceleration
                const easeOut = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(start + (end - start) * easeOut);
                
                element.innerText = isRupee ? `₹ ${current.toLocaleString('en-IN')}` : current.toLocaleString('en-IN');
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            } catch (error) {
                console.error('Animation error:', error);
                // Fallback to direct update
                element.innerText = isRupee ? `₹ ${end.toLocaleString('en-IN')}` : end.toLocaleString('en-IN');
            }
        };
        
        requestAnimationFrame(update);
    }

    async initializeCharts() {
        try {
            const ctx = document.getElementById('financeChart');
            if (!ctx) {
                console.warn('Chart canvas element not found');
                return;
            }

            // Create financial overview chart with error handling
            this.charts.set('financeChart', ChartUtils.createFinancialOverviewChart(ctx, this.analyticsData));
        } catch (error) {
            console.error('Failed to initialize charts:', error);
            apiUtils.showError(error, 'chart-error');
        }
    }

    setupEventListeners() {
        try {
            // Refresh data button
            const refreshBtn = document.getElementById('refresh-btn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', this.handleRefresh.bind(this));
            }

            // Export chart button
            const exportBtn = document.getElementById('export-chart-btn');
            if (exportBtn) {
                exportBtn.addEventListener('click', this.handleExportChart.bind(this));
            }

            // Handle window resize for responsive charts
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.resizeCharts();
                }, 250);
            });
        } catch (error) {
            console.error('Failed to setup event listeners:', error);
        }
    }

    async handleRefresh() {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            apiUtils.setLoading(true);
            
            await this.loadDashboardData();
            
            // Update charts with new data
            this.charts.forEach((chart, id) => {
                try {
                    if (id === 'financeChart') {
                        ChartUtils.updateChart(id, this.analyticsData);
                    }
                } catch (error) {
                    console.error(`Failed to update chart ${id}:`, error);
                }
            });
            
            apiUtils.showSuccess('Dashboard refreshed successfully!');
        } catch (error) {
            console.error('Failed to refresh dashboard:', error);
            apiUtils.showError(error, 'refresh-error');
        } finally {
            this.isLoading = false;
            apiUtils.setLoading(false);
        }
    }

    handleExportChart() {
        try {
            const exportedUrl = ChartUtils.exportChart('financeChart', 'png');
            if (exportedUrl) {
                apiUtils.showSuccess('Chart exported successfully!');
            } else {
                throw new Error('Chart export failed');
            }
        } catch (error) {
            console.error('Failed to export chart:', error);
            apiUtils.showError(error, 'export-error');
        }
    }

    resizeCharts() {
        try {
            ChartUtils.getChartManager().resizeAllCharts();
        } catch (error) {
            console.error('Failed to resize charts:', error);
        }
    }

    // Cleanup method
    destroy() {
        try {
            ChartUtils.getChartManager().destroyAllCharts();
            this.charts.clear();
        } catch (error) {
            console.error('Failed to cleanup dashboard:', error);
        }
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    let dashboard;
    
    try {
        dashboard = new DashboardManager();
        
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error caught:', event.error);
            apiUtils.showError(
                { message: 'An unexpected error occurred. Please refresh the page.' },
                'global-error'
            );
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            apiUtils.showError(
                { message: 'A network error occurred. Please check your connection.' },
                'promise-error'
            );
            event.preventDefault();
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (dashboard) {
                dashboard.destroy();
            }
        });

    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        apiUtils.showError(
            { message: 'Dashboard initialization failed. Please refresh the page.' },
            'init-error'
        );
    }
});

// Export for global access if needed
window.DashboardManager = DashboardManager;