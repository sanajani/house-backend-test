──────────────────────────────
1️⃣ Get All Users
──────────────────────────────
Client
  |
  | GET /user
  | Header: Authorization: Bearer <token>
  v
Route -> router.get('/user', isAuthenticateUser, listUsersController)
  |
Controller -> listUsersController
  |-- Call fetchAllUsers()
  |-- Return all users → 404 if none
  |
Service -> fetchAllUsers
  |-- UserModel.find()
  |
Controller -> send response
  |-- res.status(200).json({ message, data: allUsers })
  |
Client <- 200 OK / Error (401, 404, 500)

──────────────────────────────
2️⃣ Get User by ID
──────────────────────────────
Client
  |
  | GET /user/:userId
  | Header: Authorization: Bearer <token>
  v
Route -> router.get('/user/:userId', isAuthenticateUser, getUserById)
  |
Controller -> getUserController
  |-- Extract userId
  |-- Call fetchUserById(userId)
  |
Service -> fetchUserById
  |-- UserModel.findById(userId)
  |
Controller -> send response
  |-- res.status(200).json({ message, data: user })
  |
Client <- 200 OK / Error (401, 404, 500)

──────────────────────────────
3️⃣ Delete User by ID
──────────────────────────────
Client
  |
  | DELETE /user/:userId
  | Header: Authorization: Bearer <token>
  v
Route -> router.delete('/user/:userId', isAuthenticateUser, deleteUserController)
  |
Controller -> deleteUserController
  |-- Extract userId
  |-- Call deleteUserById(userId)
  |
Service -> deleteUserById
  |-- UserModel.findByIdAndDelete(userId)
  |
Controller -> send response
  |-- res.status(200).json({ message, data: true })
  |
Client <- 200 OK / Error (401, 404, 500)

──────────────────────────────
4️⃣ Get Pending Agent Requests
──────────────────────────────
Client
  |
  | GET /want-to-become-agent
  | Header: Authorization: Bearer <token>
  v
Route -> router.get('/want-to-become-agent', isAuthenticateUser, listPendingAgentsController)
  |
Controller -> listPendingAgentsController
  |-- Call fetchPendingAgentRequests()
  |
Service -> fetchPendingAgentRequests
  |-- WantToBecomeAgentModel.find()
  |-- Populate userId fields: name, phoneNumber1, agentInfo, agentRequestStatus
  |
Controller -> send response
  |-- res.status(200).json({ message, data: pendingAgents })
  |
Client <- 200 OK / Error (401, 404, 500)

──────────────────────────────
5️⃣ Accept Tenant → Agent Request
──────────────────────────────
Client
  |
  | GET /tenant-to-agent/:userId
  | Header: Authorization: Bearer <token>
  v
Route -> router.get('/tenant-to-agent/:userId', isAuthenticateUser, approveAgentRequestController)
  |
Controller -> approveAgentRequestController
  |-- Call approveAgentRole(userId)
  |
Service -> approveAgentRole
  |-- Find user by userId
  |-- Update role='agent', agentRequestStatus='approved'
  |-- Save updated user
  |
Controller -> send response
  |-- res.status(200).json({ message, data: acceptedAgent })
  |
Client <- 200 OK / Error (401, 404, 500)
