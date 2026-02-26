import AppError from "../../errors/AppError.js";
import UserModel from '../../models/UserModel.js'

const isAdminProtectedRoute = async (req, res, next) => {
    if (!req.user) {
        return next(new AppError("Unauthorized access", 401));
    }
    const {role} = await UserModel.findById(req?.user?.id)
    if (role !== 'admin') {
        return next(new AppError("Forbidden: Admins only", 403));
    }

    next();
};
export default isAdminProtectedRoute