import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await taskService.getAnalytics();
      setAnalytics(data.analytics || null);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Failed to load task analytics');
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Helper percentages and metrics calculation
  const total = analytics?.totalTasks || 0;
  const completed = analytics?.completedTasks || 0;
  const pending = analytics?.pendingTasks || 0;
  const inProgress = analytics?.inProgressTasks || 0;

  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0;
  const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;

  // Donut chart conic-gradient calculation
  const p1 = (completed / (total || 1)) * 100;
  const p2 = p1 + (pending / (total || 1)) * 100;

  const highPriority = analytics?.priorityBreakdown?.high || 0;
  const mediumPriority = analytics?.priorityBreakdown?.medium || 0;
  const lowPriority = analytics?.priorityBreakdown?.low || 0;

  const maxPriorityCount = Math.max(highPriority, mediumPriority, lowPriority, 1);

  return (
    <div>
      {/* Top Title & Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Task Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Overview of your productivity and task distribution
          </p>
        </div>
        <button onClick={fetchAnalytics} className="btn btn-secondary btn-sm">
          Refresh Data
        </button>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="alert alert-danger" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{errorMessage}</span>
          <button onClick={fetchAnalytics} className="btn btn-secondary btn-sm">
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : !analytics || analytics.totalTasks === 0 ? (
        /* Empty State */
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3 className="empty-state-title">No analytics available</h3>
          <p className="empty-state-desc">
            You do not have any tasks created yet. Create tasks on your dashboard to view productivity analytics.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Metric Cards matching Reference Image */}
          <div className="analytics-grid" style={{ marginBottom: '1.75rem' }}>
            {/* Total Tasks Card */}
            <div className="metric-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                📄
              </div>
              <div>
                <div className="metric-title">Total Tasks</div>
                <div className="metric-value">{total}</div>
              </div>
            </div>

            {/* Completed Tasks Card */}
            <div className="metric-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--status-completed-bg)',
                color: 'var(--status-completed-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                ✅
              </div>
              <div>
                <div className="metric-title">Completed Tasks</div>
                <div className="metric-value" style={{ color: 'var(--status-completed-text)' }}>
                  {completed}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-completed-text)', marginTop: '0.1rem', fontWeight: 600 }}>
                  {completedPct}% of total
                </div>
              </div>
            </div>

            {/* Pending Tasks Card */}
            <div className="metric-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--status-pending-bg)',
                color: 'var(--status-pending-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                🕒
              </div>
              <div>
                <div className="metric-title">Pending Tasks</div>
                <div className="metric-value" style={{ color: 'var(--status-pending-text)' }}>
                  {pending}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-pending-text)', marginTop: '0.1rem', fontWeight: 600 }}>
                  {pendingPct}% of total
                </div>
              </div>
            </div>

            {/* In-Progress Tasks Card */}
            <div className="metric-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--status-inprogress-bg)',
                color: 'var(--status-inprogress-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                🔄
              </div>
              <div>
                <div className="metric-title">In-Progress Tasks</div>
                <div className="metric-value" style={{ color: 'var(--status-inprogress-text)' }}>
                  {inProgress}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-inprogress-text)', marginTop: '0.1rem', fontWeight: 600 }}>
                  {inProgressPct}% of total
                </div>
              </div>
            </div>
          </div>

          {/* Visual Breakdowns Section matching Reference Image */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Status Breakdown Donut Widget */}
            <div className="metric-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                Status Breakdown
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                {/* Donut Ring Visual */}
                <div style={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: `conic-gradient(#10b981 0% ${p1}%, #f59e0b ${p1}% ${p2}%, #0284c7 ${p2}% 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>{total}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Total</span>
                  </div>
                </div>

                {/* Donut Legend Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                      <span>Completed</span>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{completed} ({completedPct}%)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                      <span>Pending</span>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{pending} ({pendingPct}%)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span>
                      <span>In Progress</span>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{inProgress} ({inProgressPct}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Breakdown Progress Bars Widget */}
            <div className="metric-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                Priority Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* High Priority Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                    <span>High Priority</span>
                    <span style={{ fontWeight: 600 }}>{highPriority}</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(highPriority / maxPriorityCount) * 100}%`,
                      backgroundColor: '#ef4444',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>

                {/* Medium Priority Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                    <span>Medium Priority</span>
                    <span style={{ fontWeight: 600 }}>{mediumPriority}</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(mediumPriority / maxPriorityCount) * 100}%`,
                      backgroundColor: '#f59e0b',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>

                {/* Low Priority Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                    <span>Low Priority</span>
                    <span style={{ fontWeight: 600 }}>{lowPriority}</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(lowPriority / maxPriorityCount) * 100}%`,
                      backgroundColor: '#64748b',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
