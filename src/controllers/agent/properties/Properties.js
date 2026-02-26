// // properties controller
import AppError from '../../../errors/AppError.js';
import { createProperty, deletePropertyService, fetchPropertiesByAgent, fetchPropertyByIDService, updatePropertyService } from '../../../services/agent/propertiesServices.js';
import { asyncErrorHandler } from "../../../utils/asyncErrorHandler.js"
import { propertiesValidation } from '../../../validations/properties/properties.js'
import { uploadImagesToBunny } from '../../../middlewares/Bunny_CDN.js';
import { PropertiesModel } from '../../../models/properties/PropertiesModel.js';

// // properties controller
// // add property 
export const createPropertyByAgentController = asyncErrorHandler(async (req,res,next) => {
    const agentId = req.user?.id;
    const role = req.user?.role;

    if(!agentId || role !== 'agent') return next(new AppError("Invalid credentials", 403)) 
    if(!req.body || Object.keys(req.body).length === 0) return next(new AppError("Request body is missing", 400))

    const mediaMetadata = req.body.media_metadata.map(item => JSON.parse(item));
    
    // Create media array with URLs from uploaded files
    const mediaArray = req?.files?.map((file, index) => ({
        url: 'his is some', // or file.filename, or construct full URL
        public_id: mediaMetadata[index]?.public_id || Date.now() + index,
        caption: mediaMetadata[index]?.caption || "One of the beautiest house in the market",
        isPrimary: mediaMetadata[index]?.isPrimary || false
    })) || [];

          // Parse JSON strings
  const propertyData = {
    agent: req?.user?.id,
    title: req?.body?.title,
    description: req?.body?.description,
    propertyType: req?.body?.propertyType,
    amenities: JSON.parse(req?.body?.amenities),
    dealType: req?.body?.transaction,
    location: JSON.parse(req?.body?.location),
    details: JSON.parse(req?.body?.details),
    price: JSON.parse(req?.body?.price),
    media: mediaArray
  };

    // validation on req body
    const {error, value} = propertiesValidation.validate(propertyData);
    
    if(error) {
        return next(new AppError(error.details[0].message, 400))
    }
    
    const property = await createProperty(value, agentId);

    const filesURL = await uploadImagesToBunny(property?._id, req?.files) || []

        // Create media array with URLs from uploaded files
    const cdnURL = filesURL?.map((file, index) => ({
        url: file?.url, // or file.filename, or construct full URL
        public_id: mediaMetadata[index]?.public_id || Date.now() + index,
        caption: mediaMetadata[index]?.caption || "One of the beautiest house in the market",
        isPrimary: mediaMetadata[index]?.isPrimary || false
    })) || [];
    property.media = cdnURL
    
    const newPorperty = await property.save();
    
    return res.status(201).json({
        message: "Successfully property created",
        data: newPorperty
    })
})

// update property controller - everything in one place
export const updatePropertyById = asyncErrorHandler(async (req, res, next) => {
    const propertyId = req.params?.propertyId;
    const agentId = req.user?.id;
    const role = req.user?.role;

    // 1. CHECK PERMISSIONS
    if (!agentId || role !== 'agent') {
        return next(new AppError("Only agents can update properties", 403));
    }

    // 2. FIND PROPERTY AND CHECK OWNERSHIP
    const property = await PropertiesModel.findOne({ _id: propertyId, agent: agentId });
    
    if (!property) {
        return next(new AppError("Property not found or you don't have permission", 404));
    }

    console.log("Found property:", property._id);

    // 3. PARSE ALL JSON FIELDS FROM FORMDATA
    let updateFields = {};
    
    try {
        // Basic fields
        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.description) updateFields.description = req.body.description;
        if (req.body.propertyType) updateFields.propertyType = req.body.propertyType;
        if (req.body.transaction) updateFields.dealType = req.body.transaction;

        // Parse JSON fields
        if (req.body.location) {
            updateFields.location = JSON.parse(req.body.location);
        }
        
        if (req.body.details) {
            updateFields.details = JSON.parse(req.body.details);
        }
        
        if (req.body.price) {
            updateFields.price = JSON.parse(req.body.price);
        }
        
        if (req.body.amenities) {
            updateFields.amenities = JSON.parse(req.body.amenities);
        }

    } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return next(new AppError("Invalid JSON format in form data", 400));
    }

    // 4. HANDLE EXISTING IMAGES (images to keep)
    let imagesToKeep = [];
    if (req.body.existingImages) {
        try {
            imagesToKeep = JSON.parse(req.body.existingImages);
            console.log("Keeping existing images:", imagesToKeep);
        } catch (e) {
            console.log("Error parsing existingImages:", e);
        }
    }

    // 5. FILTER MEDIA - KEEP ONLY SELECTED EXISTING IMAGES
    if (imagesToKeep.length > 0) {
        // Keep only images whose public_id is in imagesToKeep array
        property.media = property.media.filter(img => 
            imagesToKeep.includes(img.public_id)
        );
        console.log(`Kept ${property.media.length} existing images`);
    } else if (req.body.existingImages === '[]') {
        // Client explicitly sent empty array - remove all existing images
        property.media = [];
        console.log("Removed all existing images");
    }

    // 6. HANDLE NEW IMAGE UPLOADS
    if (req.files && req.files.length > 0) {
        console.log(`Uploading ${req.files.length} new images to Bunny CDN...`);
        
        // Upload to Bunny CDN
        const uploadedFiles = await uploadImagesToBunny(propertyId, req.files) || [];
        console.log(`Uploaded ${uploadedFiles.length} files to CDN`);

        // Parse media metadata for new files
        let mediaMetadata = [];
        if (req.body.media_metadata) {
            try {
                // Handle both array and single metadata
                if (Array.isArray(req.body.media_metadata)) {
                    mediaMetadata = req.body.media_metadata.map(item => 
                        typeof item === 'string' ? JSON.parse(item) : item
                    );
                } else if (typeof req.body.media_metadata === 'string') {
                    mediaMetadata = [JSON.parse(req.body.media_metadata)];
                }
            } catch (e) {
                console.log("Error parsing media_metadata:", e);
            }
        }

        // Create media objects for new images
        const newMedia = uploadedFiles.map((file, index) => ({
            url: file.url || file.path || `https://your-bunny-cdn.com/${file.filename}`,
            public_id: mediaMetadata[index]?.public_id || `img_${Date.now()}_${index}`,
            caption: mediaMetadata[index]?.caption || "Property image",
            isPrimary: mediaMetadata[index]?.isPrimary || false
        }));

        // Add new images to property media array
        property.media = [...property.media, ...newMedia];
        console.log(`Added ${newMedia.length} new images`);
    }

    // 7. UPDATE OTHER FIELDS
    const fieldsToUpdate = ['title', 'description', 'propertyType', 'dealType', 'amenities', 'location', 'details', 'price'];
    
    fieldsToUpdate.forEach(field => {
        if (updateFields[field] !== undefined) {
            property[field] = updateFields[field];
        }
    });

    // 8. SAVE UPDATED PROPERTY
    property.updatedAt = Date.now();
    const updatedProperty = await property.save();
    
    console.log("Property updated successfully");

    // 9. RETURN RESPONSE
    return res.status(200).json({
        success: true,
        message: "Property updated successfully",
        data: updatedProperty
    });
});

// update status of the property
export const updateStatus = asyncErrorHandler(async (req, res, next) => {
    const propertyId = req.params?.propertyId;
    const agentId = req.user?.id;
    const role = req.user?.role;
    
    const { status } = req.body; // Get status from request body

    // Check if user is an agent
    if (role !== 'agent') {
        return next(new AppError("Only agents can update property status", 403));
    }

    // Validate status
    const validStatuses = ['pending', 'rented', 'sold', 'gerawed'];
    if (!validStatuses.includes(status)) {
        return next(new AppError("Invalid status value", 400));
    }

    // Find and update only the status field
    const updatedProperty = await PropertiesModel.findOneAndUpdate(
        { 
            _id: propertyId, 
            agent: agentId // Ensure the property belongs to this agent
        },
        { 
            $set: { status: status } // Only update the status field
        },
        { 
            new: true, // Return the updated document
            runValidators: true // Run schema validators
        }
    );

    // Check if property exists and belongs to agent
    if (!updatedProperty) {
        return next(new AppError("Property not found or you don't have permission", 404));
    }

    // Send response
    return res.status(200).json({
        success: true,
        message: "Property status updated successfully",
        data: {
            _id: updatedProperty._id,
            status: updatedProperty.status,
            title: updatedProperty.title
        }
    });
});

// // properties controller
// get all properties
export const getAllPropertiesByAgentController = asyncErrorHandler(async (req,res,next) => {
    
    const agentId = req.user.id;
    if(!agentId) {
        return next(new AppError("User Id is missing", 400));
    }
    
    const allProperties = await fetchPropertiesByAgent(agentId);

    return res.status(200).json({
        message: "Success",
        allProperties
    })
})

// get single property by id
// // properties controller
export const getPropertyById = asyncErrorHandler(async (req,res,next) => {
    const propertyId = req.params.propertyId;
    const agentId = req.user?.id;
    if(!agentId) {
        return next("Invalid credentials",403)
    }
    if(!propertyId) {
        return next("Property ID is missing", 404)
    }
    const data = await fetchPropertyByIDService(propertyId, agentId);
    return res.status(200).json({
        message:"Success",
        data
    })
})



// // properties controller
// delete a property by ID
export const deleteProperty = asyncErrorHandler(async (req,res,next) => {
    const agentId = req.user?._id;
    const propertyId = req.params?.propertyId;
    
  await deletePropertyService(propertyId, agentId)
  return res.status(204).send()
})