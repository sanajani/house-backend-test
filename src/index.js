import 'dotenv/config';

// import limit from 'express-rate-limit';
// import helmet from 'helmet';
// import hpp from 'hpp';
// import ExpressMongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean';

import express from 'express';
import connectToMongoDB from './db/mongodbConnection.js';
import cors from 'cors';
import customError from './errors/customError.js';

const app = express();

// const limiter = limit({
//     windowMs: 45 * 60 * 1000, // 45 minutes
//     max: 100, // Limit each IP to 100 requests per `window` (here, per 45 minutes)
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

// const loginLimit = limit({
//     windowMs: 9 * 60 * 1000, // 9 minutes
//     max: 10, // Limit each IP to 100 requests per `window` (here, per 9 minutes)
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

// app.use(helmet());
// app.use('/api/v1', limiter);
// app.use('/api/v1/users/login', loginLimit);
// app.use(hpp());

const PORT = process.env.PORT || 5000;

// import  UserRoute
import userRoute from './routes/user/UserRoute.js';
import adminRoute from './routes/admin/adminRoute.js';
import agentRoute from './routes/agent/agentRoutes.js';
import properties from './routes/user/propertyRoute.js'

app.use(cors());
app.use(express.json({limit: '10kb'}));
// 3. FOR URL-ENCODED DATA (form fields) - YOU NEED THIS!
app.use(express.urlencoded({ 
  extended: true,  // Allows nested objects
  limit: '50mb' 
}));

// app.use(ExpressMongoSanitize());
// app.use(xss());

// Use UserRoute for user-related endpoints
app.use('/api/v1/users', userRoute);
app.use('/api/v1/properties', properties);

// admin routes
app.use('/api/v1/admin', adminRoute);

// agent routes
app.use('/api/v1/agent', agentRoute)

// 404 Error handling middleware
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global Error Handling Middleware
app.use(customError);

// Start the server
app.listen(PORT, () => {

    connectToMongoDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});

