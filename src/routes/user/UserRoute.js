import express from 'express';
import { 
    registerUserController, 
    loginUserController, 
    getMyProfileController, 
    allUsers, updateMyProfileController, 
    requestAgentController } from '../../controllers/user/userController.js';
import { isAuthenticateUser } from '../../auth/auth.js';

const router = express.Router();

// Sample user data
// ==>  api/v1/users/register
router.post('/register', registerUserController);

// ==>  api/v1/users/login
router.post('/login', loginUserController);

// ==>  api/v1/users/me
router.get('/me', isAuthenticateUser, getMyProfileController);

// ==>  api/v1/users/me
router.put('/me', isAuthenticateUser, updateMyProfileController);

// ==>  api/v1/users/become-agent
router.put('/become-agent', isAuthenticateUser, requestAgentController)

export default router;

