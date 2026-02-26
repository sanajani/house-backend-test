import mongoose from "mongoose";

const wantToBecomeAgentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    agentRequestStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', null],
        default: 'pending'
    }
},{
    timestamps: true
});

const WantToBecomeAgentModel = mongoose.model('WantToBecomeAgent', wantToBecomeAgentSchema);

export default WantToBecomeAgentModel;
