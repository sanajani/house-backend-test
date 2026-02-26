import AppError from "../../errors/AppError.js";
import UserModel from "../../models/UserModel.js";

const isAgentProtectedRoute = async (req, res, next) => {
    
    if (!req.user) {
        return next(new AppError("Unauthorized access", 401));
    }
    const userID = req?.user?.id;
    const {role} = await UserModel.findById(userID)

    if (role !== 'agent') {
        return next(new AppError("Forbidden: Agents only", 403));
    }
    req.user.role = role;
    
    next();
};

export default isAgentProtectedRoute