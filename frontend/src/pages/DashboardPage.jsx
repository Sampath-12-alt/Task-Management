import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import TaskFormModal from '../components/TaskFormModal';
import { taskService } from '../services/api';

const DashboardPage = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [taskRes, analyticsRes] = await Promise.all([
        taskService.getTasks({
          search: search.trim() || undefined,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          sortBy,
          order,
          page,
          limit: 10
        }),
        taskService.getAnalytics()
      ]);

      setTasks(taskRes.tasks || []);
      if (taskRes.pagination) {
        setPagination(taskRes.pagination);
      }
      if (analyticsRes.analytics) {
        setAnalytics(analyticsRes.analytics);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Failed to load dashboard data from server');
    }
  }, [search, statusFilter, priorityFilter, sortBy, order, page]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOpenCreateModal = useCallback(() => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    const handleOpenModalEvent = () => {
      handleOpenCreateModal();
    };

    window.addEventListener('open_create_task_modal', handleOpenModalEvent);

    if (location.state?.openCreateModal) {
      handleOpenCreateModal();
      window.history.replaceState({}, document.title);
    }

    return () => {
      window.removeEventListener('open_create_task_modal', handleOpenModalEvent);
    };
  }, [location.state, handleOpenCreateModal]);

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    setErrorMessage('');
    try {
      if (taskToEdit) {
        await taskService.updateTask(taskToEdit._id, taskData);
      } else {
        await taskService.createTask(taskData);
      }
      setIsModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save task');
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    setErrorMessage('');
    try {
      await taskService.deleteTask(taskToDelete._id);
      setTaskToDelete(null);
      fetchDashboardData();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete task');
    }
  };

  const handleStatusToggle = async (task, newStatus) => {
    setErrorMessage('');
    try {
      await taskService.updateTaskStatus(task._id, newStatus);
      fetchDashboardData();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update task status');
    }
  };

  // Helper percentage calculations
  const total = analytics.totalTasks || 0;
  const completedPct = total > 0 ? Math.round((analytics.completedTasks / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.round((analytics.pendingTasks / total) * 100) : 0;
  const inProgressPct = total > 0 ? Math.round((analytics.inProgressTasks / total) * 100) : 0;

  return (
    <div>
      {/* Dashboard Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Tasks Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage and track your tasks efficiently
          </p>
        </div>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          <span style={{ fontSize: '1rem' }}>+</span> Create Task
        </button>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="alert alert-danger" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="btn btn-secondary btn-sm">
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar matching Reference Image */}
      <div className="toolbar" style={{ marginBottom: '1.5rem' }}>
        <div className="toolbar-filters" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search tasks by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{ paddingLeft: '2.25rem' }}
            />
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, fontSize: '0.875rem' }}>
              🔍
            </span>
          </div>

          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '130px' }}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '130px' }}
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split('-');
              setSortBy(s);
              setOrder(o);
              setPage(1);
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="title-asc">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Summary Metric Cards Grid matching Reference Image */}
      <div className="analytics-grid" style={{ marginBottom: '1.75rem' }}>
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
            <div className="metric-value">{analytics.totalTasks}</div>
          </div>
        </div>

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
              {analytics.completedTasks}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-completed-text)', marginTop: '0.1rem', fontWeight: 600 }}>
              {completedPct}% of total
            </div>
          </div>
        </div>

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
              {analytics.pendingTasks}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-pending-text)', marginTop: '0.1rem', fontWeight: 600 }}>
              {pendingPct}% of total
            </div>
          </div>
        </div>

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
              {analytics.inProgressTasks}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-inprogress-text)', marginTop: '0.1rem', fontWeight: 600 }}>
              {inProgressPct}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">No tasks found</h3>
          <p className="empty-state-desc">
            {search || statusFilter || priorityFilter
              ? 'No tasks match your current filter criteria. Try clearing filters or changing search terms.'
              : 'You have not created any tasks yet. Click "Create Task" to get started.'}
          </p>
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            <span>+</span> Create Task
          </button>
        </div>
      ) : (
        /* Compact Task List Row Layout matching Reference Image */
        <div className="task-list-container">
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
            Tasks
          </div>
          {tasks.map(task => (
            <div key={task._id} className="task-list-row">
              <div className="task-row-left">
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => handleStatusToggle(task, task.status === 'completed' ? 'pending' : 'completed')}
                  title={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
                />
                <div className="task-row-details">
                  <span className="task-row-title">{task.title}</span>
                  <span className="task-row-priority">
                    Priority: <span className={`priority-label-${task.priority}`} style={{ textTransform: 'capitalize' }}>{task.priority}</span>
                  </span>
                </div>
              </div>

              <div className="task-row-middle">
                <span className={`badge badge-${task.status}`}>{task.status}</span>
                <span className="task-row-date">
                  📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </span>
              </div>

              <div className="task-row-actions">
                {task.status === 'completed' && (
                  <button
                    onClick={() => handleStatusToggle(task, 'pending')}
                    className="btn btn-secondary btn-sm"
                  >
                    Undo
                  </button>
                )}
                <button onClick={() => handleOpenEditModal(task)} className="btn btn-secondary btn-sm">
                  Edit
                </button>
                <button onClick={() => setTaskToDelete(task)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Container */}
      {!isLoading && tasks.length > 0 && (
        <div className="pagination-container">
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total tasks)
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
              className="btn btn-secondary btn-sm"
              disabled={page >= pagination.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Task Creation / Edit Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Delete Task</h3>
              <button onClick={() => setTaskToDelete(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Are you sure you want to delete <strong>"{taskToDelete.title}"</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={() => setTaskToDelete(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={confirmDeleteTask} className="btn btn-danger">
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
