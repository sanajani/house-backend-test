import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    phoneNumber1: {
        type: String,
        unique: true,
        sparse: true,
        required: true,
        index: true

    },
    password: {
        type: String,
        required: true,
        minlength: 2,
        select: false
    },
    phoneNumber2: {
        type: String,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
    },
    province:{
        type: String,
    },
    district:{
        type: String,
    },
    preferedLocation:{
        type: [String],
        default: []
    },
    role: {
        type: String,
        enum: ['tenant','agent','admin'],
        default: 'tenant'
    },
    savedProperties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }],
    searchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }],
       // === STATUS ===
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
        // === Agent-specific fields (Only if role = 'agent') ===
    agentInfo: {
        licenseNumber: String,
        agencyName: String,
        experienceYears: String,
        specialization: [String],
        bio: String,
        profilePicture: String,
        isVerifiedAgent: {
            type: Boolean,
            default: false
        }
    },
    hasRequestedAgent: {
        type: Boolean,
        default: false
    },
    agentRequestStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', null],
        default: null
    },
    
    
}, { 
    timestamps: true, 
    indexes: [
        {phoneNumber1: 1}
    ] });

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
