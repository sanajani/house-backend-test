import AppError from '../../errors/AppError.js';
import {PropertiesModel} from '../../models/properties/PropertiesModel.js'

export const getAllPropertiesService = async (page, limit, province, dealType, houseRent, propertyType) => {
    const pageNumber = parseInt(page) || 1;
    
    const limitItems = parseInt(limit) || 10;

    let query = {}

    if(dealType) query['dealType'] = dealType;
    if(propertyType) query['propertyType'] = propertyType;
    if(province) query['location.province'] = province;
    if(houseRent){
        query['price.amount'] = {}
        if(houseRent === "under_5000") query['price.amount'].$lte = 5000;
        if(houseRent === "under_10000") query['price.amount'].$lte = 10000;
        if(houseRent === "under_15000") query['price.amount'].$lte = 15000;
        if(houseRent === "under_25000") query['price.amount'].$lte = 25000;
        if(houseRent === "under_50000") query['price.amount'].$lte = 50000;
        if(houseRent === "above_50000") query['price.amount'].$gte = 50001; // Assuming above 50,000 is the minimum for "above_50k"
    }
    // const properties = await PropertiesModel.find(query).lean()
    const properties = await PropertiesModel.find(query).select('title views status description propertyType dealType media location transaction price').lean()
        .skip((pageNumber - 1 )* limitItems)
        .limit(limitItems)
        .sort({createdAt: -1});

    const totalDocuments = await PropertiesModel.countDocuments(query);
    const pages = Math.ceil(totalDocuments / limitItems);
    
    if(!properties || properties.length === 0) {
        return {properties: [], pageNumber, pages};
    }

    return {properties, pageNumber, pages}
}


// export const getSinglePropertyByIdService = async (propertyId) => {
//     const property = await PropertiesModel.findById(propertyId).populate('agent','name agentInfo')
//     if(!property) {
//         throw new AppError("Property Not Found", 404);
//     }

//     property.views += 1;
//     await property.save();

//     return property
// }

export const getSinglePropertyByIdService = async (propertyId) => {
  const property = await PropertiesModel.findByIdAndUpdate(
    propertyId,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('agent', 'name agentInfo');

  if (!property) {
    throw new AppError("Property Not Found", 404);
  }

  return property;
};