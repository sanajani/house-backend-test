import AppError from "../../errors/AppError.js";
import {PropertiesModel} from '../../models/properties/PropertiesModel.js'
import mongoose from "mongoose";

// CREATE PROPERTY BT AGENT SERVICE
export const createProperty = async (reqData, agentId) => {
  return PropertiesModel.create({...reqData, agent: agentId})
}

// FETCH SINGLE PROPERTY BY AGENT
export const fetchPropertiesByAgent = async (agentId) => {
    
    const properties = await PropertiesModel.find({agent: agentId}, 'title status description price propertyType dealType views').populate('agent' , "name")
    
    if(!properties || properties.length === 0){
        return ("There is no property for that agent");
    }

    return properties
}

// DELETE PROPERTY BY AGENT AND BY ID
export const deletePropertyService = async (propertyId, agentId) => {
    
    const deletedProperty = await PropertiesModel.deleteOne({_id: propertyId, agent: agentId})
    if(deletedProperty.deletedCount === 0) {
        throw new AppError("Invalid credintials or data not found", 403)
    }
            
    return true
}
// FETCH SINGLE PROPERTY SERVICE
export const fetchPropertyByIDService = async (propertyId, agentId) => {
    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
        throw new AppError("Invalid property ID", 400);
    }
    const property = await PropertiesModel.findById(propertyId);
    if(!property){
        throw new AppError("Property does not exist", 404);
    }
    if(!property.agent.equals(agentId)){
        throw new AppError("Invalid credentials",403)
    }
    return property
}

// UPDATE SINGLE DOCUMENT BY AGENT 
export const updatePropertyService = async (propertyId, agentId, updateData) => {
 // 1️⃣ Validate propertyId

  if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
    throw new AppError("Invalid property ID", 400);
  }
      // 2️⃣ Find the property
  const property = await PropertiesModel.findById(propertyId);
        if (!property) {
            throw new AppError("Property does not exist", 404);
        }
        // 3️⃣ Check ownership
        if (!property.agent.equals(agentId)) {
            throw new AppError("Invalid credentials", 403);
        }

//   const updatedProperty = await PropertiesModel.findByIdAndUpdate(propertyId, {...updateData}, {new: true})
  

  // 4️⃣ Merge updateData into property safely
  Object.keys(updateData).forEach((key) => {
    if (typeof updateData[key] === "object" && !Array.isArray(updateData[key])) {
      // Merge nested object
      property[key] = { ...property[key].toObject(), ...updateData[key] };
    } else {
      // Replace primitive value or array
      property[key] = updateData[key];
    }
  });

  // 5️⃣ Save the updated property
  const updatedProperty = await property.save();

  if(!updatedProperty){
    throw new AppError("Property did't updated", 403)
  }
  return updatedProperty
}
