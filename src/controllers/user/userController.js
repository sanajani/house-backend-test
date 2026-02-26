// user models
import UserModel from '../../models/UserModel.js';

// import AppError from '../../errors/AppError.js';
import AppError from '../../errors/AppError.js';
import { getMyProfile, loginUser, registerUser, updateMyProfile, requestAgentRole } from '../../services/user/userServices.js';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler.js';
import { registerationSchemaValidation, loginSchemaValidation } from '../../validations/registerationJoiValidation.js';

// USER CONTROLLER 

// Controller to handle user registration
export const registerUserController = asyncErrorHandler(async (req,res, next) => {
    
    if(!req.body || Object.keys(req.body).length === 0) {
        return next(new AppError('Request body is missing', 400));
    }
    const userData = req.body;

    // Logic to handle user registration using userData
    const { error } = registerationSchemaValidation.validate(userData);
    
    if( error ) {
        return next(new AppError(error.details[0].message, 400));
    }

    const user = await registerUser(userData);
    if(!user) {
        return next(new AppError('User registration failed', 500));
    }
    
    res.status(201).json({ message: 'User registered successfully', data: user });
});

// controller to handle user login
export const loginUserController = asyncErrorHandler(async (req,res,next) => {
    
    if(!req.body || Object.keys(req.body).length === 0) {
        return next(new AppError('Request body is missing', 400));
    }
    const loginData = req.body;

    const { error } = loginSchemaValidation.validate(loginData);
    
    if( error ) 
        return next(new AppError(error?.details[0].message, 400));

    const { token, user } = await loginUser(loginData);
    if( !user || !token ) 
        return next(new AppError('User login failed', 500));

    // Logic to handle user login using loginData
    res.status(200).json({ message: 'User logged in successfully', data: {user, token} });
})

// Controller to handle get user profile
export const getMyProfileController = asyncErrorHandler(async (req,res,next) => {
    
    const userId = req?.user?.id;
    
    if(!userId) {
        return next(new AppError('User ID is missing', 400));
    }
    // Logic to get user profile using userId
    const user = await getMyProfile(userId);
    if(!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ message: 'User profile fetched successfully', data: user });
});

// Controller to handle update user profile

export const updateMyProfileController = asyncErrorHandler(async (req,res,next) => {
    
    const userId = req?.user?.id;
    if(!userId) {
        return next(new AppError('Token is missing', 400));
    }
    const updateData = req.body;
    // Logic to update user profile using userId and updateData
    const updatedUser = await updateMyProfile(userId, updateData);
    if(!updatedUser) {
        return next(new AppError('User profile update failed', 500));
    }
    res.status(200).json({ message: 'User profile updated successfully', data: updatedUser });
});

// it is test and will be removed later
export const allUsers = asyncErrorHandler(async (req, res, next) => {
    const allUsersData = await UserModel.find();
    // Logic to get all users
    res.status(200).json({ message: 'All users fetched successfully', data: allUsersData });
});

// become agent controller
export const requestAgentController = asyncErrorHandler(async (req, res, next) => {
    
    const userId = req?.user?.id;
    if(!userId) {
        return next(new AppError('Token is missing', 400));
    }
    const agentData = req.body;
    const updatedAgentStatus = await requestAgentRole(userId, agentData);
    if(!updatedAgentStatus) {
        return next(new AppError('Become agent request failed', 500));
    }
    res.status(200).json({ message: 'Become agent request submitted successfully', data: updatedAgentStatus });
});