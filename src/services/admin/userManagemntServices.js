import AppError from "../../errors/AppError.js";
import UserModel from "../../models/UserModel.js";
import WantToBecomeAgentModel from "../../models/wantToBecomeAgent.js";
// ADMIN SERVICES

export const fetchAllUsers = async () => {
    const allUsers = await UserModel.find();
    
    return allUsers
}

export const fetchUserById = async (userId) => {
    const user = await UserModel.findById(userId)
    if(!user) throw new AppError("User Not Found ",404);

    return user
}

export const deleteUserById = async (userId) => {
    const user = await UserModel.findByIdAndDelete(userId);
    if(!user) throw new AppError("User Not Found", 404);

    return true;
}

export const fetchPendingAgentRequests = async () => {
    const pendingAgents = await WantToBecomeAgentModel.find().populate('userId', 'name phoneNumber1 agentInfo createdAt');
    if(!pendingAgents || pendingAgents.length === 0){
        throw new AppError('There is no agent pending', 404);
    }
    return pendingAgents
}


export const approveAgentRole = async (userId) => {
    
    let isUserExist = await UserModel.findOne({_id: userId});

    if(!isUserExist) throw new AppError("User NOT Fount to change role", 404);

    isUserExist.role = 'agent';
    isUserExist.agentRequestStatus = 'approved'

    const approvePendingAgents = await WantToBecomeAgentModel.findOne({userId})
    approvePendingAgents.agentRequestStatus = 'approved';
    await approvePendingAgents.save();
    const becomedAgent = await isUserExist.save();
    
    return {becomedAgent, token};
}

