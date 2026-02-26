## BECOME AGENT
Client
  |
  | PUT /become-agent
  | Header: Authorization: Bearer <token>
  | Body: { name, lastName, phoneNumber1, phoneNumber2, username, province, district, agentInfo }
  v
Route -> router.put('/become-agent', isAuthenticateUser, requestAgentController)
  |
Middleware -> isAuthenticateUser
  |-- Check Authorization header exists and starts with 'Bearer '
  |-- Extract token
  |-- Verify token using verifyToken()
  |-- Attach decoded user info to req.user
  |-- Call next()
  |
Controller -> requestAgentController
  |-- Get userId from req.user
  |-- Get agentData from req.body
  |-- Call requestAgentRole(userId, agentData)
  |
Service -> requestAgentRole
  |-- Find user by userId
  |-- Check if user exists → 404 if not found
  |-- Check if user has already requested agent → 400 if true
  |-- Validate required fields in agentData → 400 if missing
  |-- Prevent role change → 400 if role provided
  |-- Update user profile with agent info
  |-- Set hasRequestedAgent = true, agentRequestStatus = 'pending'
  |-- Create record in WantToBecomeAgent collection
  |-- Return updated user object
  |
Controller -> send response
  |-- res.status(200).json({ message: 'Become agent request submitted successfully', data: updatedAgentStatus })
  |
Client <- 200 OK / Error (400, 404, 500)
