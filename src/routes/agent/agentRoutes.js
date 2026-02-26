import express from 'express';
import { 
    createPropertyByAgentController, 
    deleteProperty, 
    getAllPropertiesByAgentController, 
    getPropertyById, 
    updatePropertyById,
    updateStatus // 👈 Import the new controller
} from '../../controllers/agent/properties/Properties.js';
import { upload } from '../../middlewares/multer.js';
import isAgentProtectedRoute from '../../auth/agentAuth/isAgent.js';
import { isAuthenticateUser } from '../../auth/auth.js';

const router = express.Router();

router.use(isAuthenticateUser, isAgentProtectedRoute);

// ----------------------
// /api/v1/agent/property
// ----------------------

// Create a new property
router.post("/property", upload.array("media", 30), createPropertyByAgentController);

// Get all properties of logged-in agent
router.get("/property", getAllPropertiesByAgentController);

// ----------------------
// /api/v1/agent/property/:propertyId
// ----------------------

// Get single property by ID
router.get("/property/:propertyId", getPropertyById);

// Update property by ID (full update)
router.patch("/property/:propertyId", upload.array("media", 30), updatePropertyById);

// 👇 NEW ROUTE: Update only status (no file upload needed)
router.patch("/property/:propertyId/status", updateStatus); // No upload middleware needed

// Delete property by ID
router.delete("/property/:propertyId", deleteProperty);

export default router;