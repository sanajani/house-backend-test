import { getAllPropertiesService, getSinglePropertyByIdService } from '../../services/user/propertiesServices.js';
import {asyncErrorHandler} from '../../utils/asyncErrorHandler.js';


// get all properties console
export const allOfProperties = asyncErrorHandler(async (req,res,next) => {
    const {
            page,
            limit,
            province,
            dealType,
            houseRent,
            propertyType
    } = req.query;

    const properties = await getAllPropertiesService(page, limit, province, dealType, houseRent, propertyType);
    return res.status(200).json({
        message:"Success",
        data: properties
    })
})

// get single property
export const singleProperty = asyncErrorHandler(async (req,res,next) => {
    const propertyId = req.params.propertyId;

    const property = await getSinglePropertyByIdService(propertyId)

    return res.status(200).json({
        message: "Success",
        data: property
    })
})