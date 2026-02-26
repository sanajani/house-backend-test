1️⃣ User Registration
---------------------
Client
  |
  | POST /register
  | Body: { name, lastName, phoneNumber1, email?, password }
  v
Route -> router.post('/register', registerUserController)
  |
Controller -> registerUserController
  |-- Check request body exists
  |-- Validate request body with registerationSchemaValidation
  |-- Call registerUser(userData)
  |
Service -> registerUser
  |-- Check if user already exists (phone/email/username)
  |-- Hash password with bcrypt
  |-- Create and save new user in DB
  |
Controller -> send response
  |-- res.status(201).json({ message, data: user })
  |
Client <- 201 Created / Error (400, 409, 500)

-------------------------------------------------

2️⃣ User Login
--------------
Client
  |
  | POST /login
  | Body: { phoneNumber1, password }
  v
Route -> router.post('/login', loginUserController)
  |
Controller -> loginUserController
  |-- Check request body exists
  |-- Validate request body with loginSchemaValidation
  |-- Call loginUser(loginData)
  |
Service -> loginUser
  |-- Find user by phoneNumber1
  |-- Compare password with bcrypt
  |-- Generate JWT token
  |-- Remove password from user object
  |
Controller -> send response
  |-- res.status(200).json({ message, data: { user, token } })
  |
Client <- 200 OK / Error (400, 401, 500)

-------------------------------------------------

3️⃣ Get User Profile
--------------------
Client
  |
  | GET /me
  | Header: Authorization: Bearer <token>
  v
Route -> router.get('/me', isAuthenticateUser, getMyProfileController)
  |
Middleware -> isAuthenticateUser
  |-- Check Authorization header exists and starts with 'Bearer '
  |-- Extract token
  |-- Verify token using verifyToken()
  |-- Attach decoded user info to req.user
  |-- Call next()
  |
Controller -> getMyProfileController
  |-- Get userId from req.user
  |-- Call getMyProfile(userId)
  |
Service -> getMyProfile
  |-- Find user in DB by userId
  |-- Return user object
  |
Controller -> send response
  |-- res.status(200).json({ message, data: user })
  |
Client <- 200 OK / Error (401, 400, 404, 500)

-------------------------------------------------

4️⃣ Update User Profile
-----------------------
Client
  |
  | PUT /me
  | Header: Authorization: Bearer <token>
  | Body: { fields to update }
  v
Route -> router.put('/me', isAuthenticateUser, updateMyProfileController)
  |
Middleware -> isAuthenticateUser
  |-- Check Authorization header exists and starts with 'Bearer '
  |-- Extract token
  |-- Verify token using verifyToken()
  |-- Attach decoded user info to req.user
  |-- Call next()
  |
Controller -> updateMyProfileController
  |-- Get userId from req.user
  |-- Get updateData from req.body
  |-- Call updateMyProfile(userId, updateData)
  |
Service -> updateMyProfile
  |-- Find user by userId and update fields with updateData
  |-- Return updated user object
  |
Controller -> send response
  |-- res.status(200).json({ message, data: updatedUser })
  |
Client <- 200 OK / Error (401, 400, 500)

User Routes - Possible Errors
Route	Possible Errors
POST /register	400 (validation/body missing), 409 (user exists), 500 (server error)
POST /login	400 (validation/body missing), 401 (invalid login), 500 (server error)
GET /me	401 (token missing/invalid), 400 (userId missing), 404 (user not found), 500 (server error)
PUT /me	401 (token missing/invalid), 400 (token missing), 500 (update failed)
