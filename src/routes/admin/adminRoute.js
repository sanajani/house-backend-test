import express from 'express';
import { isAuthenticateUser } from '../../auth/auth.js';
import { listUsersController, getUserController, deleteUserController, listPendingAgentsController, approveAgentRequestController } from '../../controllers/admin/userManagementController.js';
import isAdminProtectedRoute from '../../auth/adminAuth/isAdmin.js';

const router = express.Router();

// api/v1/admin
router.use(isAuthenticateUser, isAdminProtectedRoute)
router.get("/user", listUsersController);
router.get("/user/:userId", getUserController);
router.delete("/user/:userId", deleteUserController);

// api/v1/admin
router.get('/pending-agent-lists',  listPendingAgentsController)
router.patch('/tenant-to-agent-accept/:userId',  approveAgentRequestController)

export default router;
