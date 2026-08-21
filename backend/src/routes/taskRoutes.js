import express from 'express';
import { createTask, getTasks, getTaskAnalytics, getTaskById, updateTask, updateTaskStatus, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to protect task routes
router.use(protect);

// @route GET /api/tasks & POST /api/tasks
router.route('/')
  .get(getTasks)
  .post(createTask);

// @route GET /api/tasks/analytics
router.get('/analytics', getTaskAnalytics);

// @route GET /api/tasks/:id, PUT /api/tasks/:id, DELETE /api/tasks/:id
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// @route PATCH /api/tasks/:id/status
router.route('/:id/status')
  .patch(updateTaskStatus);

export default router;
