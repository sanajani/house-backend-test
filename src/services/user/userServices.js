import AppError from "../../errors/AppError.js";
import UserModel from "../../models/UserModel.js";
import WantToBecomeAgentModel from "../../models/wantToBecomeAgent.js";

import generateJWTToken from "../../utils/generateJWTToken.js";

import bcrypt from 'bcryptjs';

// Service to register user
export const registerUser = async (userData) => {
    // const query = [];
    // if(userData.phoneNumber1) query.push({phoneNumber1: userData.phoneNumber1})
    // if(userData.email) query.push({email: userData.email})
    // if(userData.username) query.push({username: userData.username})

    
    // Business logic for registering a user would go here
    const isUserExists = await UserModel.findOne({
        phoneNumber1: userData.phoneNumber1
    })
    
    if(isUserExists) throw new AppError('User already exist', 409);

    userData.password = await bcrypt.hash(userData.password, 12);


    const newUser = new UserModel(userData);
    return await newUser.save();
};

// Service to login user
export const loginUser = async (userData) => {
    
    const user = await UserModel.findOne({ phoneNumber1: userData.phoneNumber1 }).select('+password name lastName phoneNumber1 email username province role');
    if(!user) throw new AppError('Invalid phone number or password', 401);

    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    if(!isPasswordValid) throw new AppError('Invalid phone number or password', 401);
    const token = generateJWTToken(user);
    // user.token = token;
    user.password = undefined;
    return {token, user};
}

// Service to get user profile
export const getMyProfile = async (userId) => {
    // change it that for now for only user route
    const user = await UserModel.findById(userId).select("name lastName role phoneNumber1 email province district hasRequestedAgent agentRequestStatus");
    if(!user) throw new AppError('User not found', 404);
    return user;
}

// Service to update user profile
export const updateMyProfile = async (userId, updateData) => {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, { new: true }).select("name lastName phoneNumber1 province role email district").lean();
    return updatedUser;
}

export const requestAgentRole = async (userId, userData) => {
    const existingUser = await UserModel.findById(userId);
    
    if(!existingUser) {
        throw new AppError('User not found', 404);
    }
    if(existingUser.hasRequestedAgent) {
        throw new AppError('User has already requested to become an agent', 400);
    }
        const {
  name,
  lastName,
  phoneNumber1,
  phoneNumber2,
  email,
  username,
  province,
  district,
  role,
  agencyName,
  experienceYears,
  specialization,
  bio
    } = userData;

    if(role){
        throw new AppError('user can not change role', 400);
    }

    if(!name || !lastName || !phoneNumber1 || !phoneNumber2 || !province || !district || !agencyName ) {
    throw new AppError('All fields are required to become an agent', 400);
    }
    const updatedAgentStatus = await UserModel.findByIdAndUpdate(userId, 
        {
            name,
            lastName,
            phoneNumber1,
            email,
            username,
            province,
            district,
            hasRequestedAgent: true,
            agentRequestStatus: 'pending',
            phoneNumber2,
            agentInfo: {
                agencyName,
                experienceYears,
                specialization,
                bio,
            }
        },
        { new: true }
    );
    if(!updatedAgentStatus) {
        throw new AppError('Failed to update user to agent', 500);
    }
    
    const wantToBecomeAgent = new WantToBecomeAgentModel({ userId });
    await wantToBecomeAgent.save();
    return updatedAgentStatus;
}
