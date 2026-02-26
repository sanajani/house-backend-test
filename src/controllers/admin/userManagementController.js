import AppError from "../../errors/AppError.js";
import { fetchAllUsers, deleteUserById, fetchUserById, fetchPendingAgentRequests, approveAgentRole } from "../../services/admin/userManagemntServices.js";
import { asyncErrorHandler } from "../../utils/asyncErrorHandler.js";

// ADMIN CONTROLLER 

// get all users
export const listUsersController = asyncErrorHandler(async (req,res,next) => {
    const allUsers = await fetchAllUsers()
    if(!allUsers || allUsers.length === 0){
        return next(new AppError("Users Not Found", 404))
    }
    res.status(200).json({
        message:"Success",
        data: allUsers
    })
})

// get user by id
export const getUserController = asyncErrorHandler(async (req,res,next) => {
    const {userId} = req.params;
    
    if(!userId) return next(new AppError("User ID is Missing", 404));
    const user = await fetchUserById(userId);

    res.status(200).json({
        message:"Success",
        data: user
    })
})

// delete user by id
export const deleteUserController = asyncErrorHandler(async (req, res, next) => {
    const {userId} = req.params;
    if(!userId) return next(new AppError("User ID is Missing", 404));

    await deleteUserById(userId);

    res.status(200).json({
        message:"Success",
        data: true
    })
}) 

// all pending agents
export const listPendingAgentsController = asyncErrorHandler(async (req,res, next) => {
    const pendingAgents = await fetchPendingAgentRequests();
    return res.status(200).json({
        message: "Success",
        data: pendingAgents
    })
})

export const approveAgentRequestController = asyncErrorHandler(async (req, res, next) => {
    const {userId} = req.params;
    
    if(!userId) return next(new AppError("UserId is required", 404));
    const acceptedAgent = await approveAgentRole(userId);
        
    return res.status(200).json({
        message:"Success",
        data: acceptedAgent
    })
})