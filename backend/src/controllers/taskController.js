import mongoose from 'mongoose';
import Task from '../models/Task.js';

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Please provide a task title' });
    }

    // Create task associated strictly with authenticated user
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate
    });

    return res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error while creating task' });
  }
};

/**
 * @desc    Get all tasks belonging to authenticated user with search, filter, sorting & pagination support
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = async (req, res) => {
  try {
    const query = { user: req.user._id };

    // Support search by title via 'search', 'title', or 'q' query parameters
    const searchTerm = req.query.search || req.query.title || req.query.q;

    if (searchTerm && searchTerm.trim() !== '') {
      query.title = { $regex: searchTerm.trim(), $options: 'i' };
    }

    // Support filter by status
    if (req.query.status) {
      const validStatuses = ['pending', 'in-progress', 'completed'];
      if (!validStatuses.includes(req.query.status)) {
        return res.status(400).json({ message: 'Invalid status filter value' });
      }
      query.status = req.query.status;
    }

    // Support filter by priority
    if (req.query.priority) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(req.query.priority)) {
        return res.status(400).json({ message: 'Invalid priority filter value' });
      }
      query.priority = req.query.priority;
    }

    // Support sorting
    const rawSortParam = req.query.sortBy || req.query.sort || 'createdAt';
    let sortField = rawSortParam;
    let sortOrder = req.query.order || req.query.direction || 'desc';

    // Handle leading minus prefix in sort parameter (e.g. sort=-dueDate)
    if (typeof sortField === 'string' && sortField.startsWith('-')) {
      sortField = sortField.substring(1);
      sortOrder = 'desc';
    }

    const validSortFields = ['dueDate', 'createdAt', 'priority', 'title'];
    if (!validSortFields.includes(sortField)) {
      return res.status(400).json({ message: 'Invalid sort field' });
    }

    const validSortOrders = ['asc', 'desc', '1', '-1'];
    if (!validSortOrders.includes(sortOrder.toString().toLowerCase())) {
      return res.status(400).json({ message: 'Invalid sort order' });
    }

    const sortDirection = (sortOrder.toString().toLowerCase() === 'asc' || sortOrder === '1') ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection };

    // Support pagination
    let page = 1;
    let limit = 10;

    if (req.query.page !== undefined) {
      page = parseInt(req.query.page, 10);
      if (isNaN(page) || page <= 0) {
        return res.status(400).json({ message: 'Invalid page number' });
      }
    }

    if (req.query.limit !== undefined) {
      limit = parseInt(req.query.limit, 10);
      if (isNaN(limit) || limit <= 0) {
        return res.status(400).json({ message: 'Invalid limit value' });
      }
    }

    const total = await Task.countDocuments(query);
    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error while retrieving tasks' });
  }
};

/**
 * @desc    Get task metrics/analytics for authenticated user
 * @route   GET /api/tasks/analytics
 * @access  Private
 */
export const getTaskAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      lowPriorityTasks,
      mediumPriorityTasks,
      highPriorityTasks
    ] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'pending' }),
      Task.countDocuments({ user: userId, status: 'in-progress' }),
      Task.countDocuments({ user: userId, status: 'completed' }),
      Task.countDocuments({ user: userId, priority: 'low' }),
      Task.countDocuments({ user: userId, priority: 'medium' }),
      Task.countDocuments({ user: userId, priority: 'high' })
    ]);

    return res.status(200).json({
      analytics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        statusBreakdown: {
          pending: pendingTasks,
          'in-progress': inProgressTasks,
          completed: completedTasks
        },
        priorityBreakdown: {
          low: lowPriorityTasks,
          medium: mediumPriorityTasks,
          high: highPriorityTasks
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error while fetching task analytics' });
  }
};

/**
 * @desc    Get single task by ID for authenticated user
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    // Query task belonging strictly to the authenticated user
    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({ task });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error while retrieving task' });
  }
};

/**
 * @desc    Update an existing task belonging to authenticated user
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    // Find task belonging strictly to authenticated user
    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    // Validate title if provided
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ message: 'Task title cannot be empty' });
    }

    // Validate status if provided
    if (status !== undefined && !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Validate priority if provided
    if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority value' });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();

    return res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error while updating task' });
  }
};

/**
 * @desc    Update only task status for authenticated user
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    // Validate status value
    if (!status || !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find task belonging strictly to authenticated user
    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    const updatedTask = await task.save();

    return res.status(200).json({
      message: 'Task status updated successfully',
      task: updatedTask
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error while updating task status' });
  }
};

/**
 * @desc    Delete a task belonging to authenticated user
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    // Find and delete task belonging strictly to authenticated user
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error while deleting task' });
  }
};
