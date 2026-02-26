Client
  |
  | POST /property
  | Header: Authorization: Bearer <token>
  | Body: { agent, title, description, propertyType, transaction, location, details, amenities, price, media }
  v
Route -> router.post('/property', createPropertyByAgent)
  |
Controller -> createPropertyByAgent
  |-- Check request body exists → 400 if missing
  |-- Validate request body with Joi (propertiesValidation)
  |     |-- Validate required fields: agent, title, description, propertyType, transaction, location, details, price
  |     |-- Validate optional fields: amenities, media
  |-- Call createProperty(req.body)
  |
Service -> createProperty
  |-- Create new PropertiesModel instance with reqData
  |-- Save property to DB
  |-- Throw 409 if save fails
  |-- Return saved property
  |
Controller -> send response
  |-- res.status(200).json({ message: "Successfully property created", data: property })
  |
Client <- 200 OK / Error (400, 409, 500)


Possible Errors
Step	Error	HTTP Code
Controller	Request body missing	400
Controller	Validation fails (Joi)	400
Service	Failed to save property	409
Service	DB error / server failure	500



Client
  |
  | GET /property
  | Header: Authorization: Bearer <token>
  v
Route -> router.get('/property', getAllPropertiesByAgent)
  |
Controller -> getAllPropertiesByAgent
  |-- Get agentId (from req.user or hardcoded in this example)
  |-- Check if agentId exists → 400 if missing
  |-- Call fetchPropertiesByAgent(agentId)
  |
Service -> fetchPropertiesByAgent
  |-- Query DB: PropertiesModel.find({ agent: agentId }, 'title')
  |-- Populate agent info: name
  |-- Check if properties exist → 404 if none
  |-- Return array of properties
  |
Controller -> send response
  |-- res.status(200).json({ message: "Success", data: allProperties })
  |
Client <- 200 OK / Error (400, 404, 500)

Possible Errors
Step	Error	HTTP Code
Controller	agentId missing	400
Service	No properties found for agent	404
Service	DB error / server failure	500