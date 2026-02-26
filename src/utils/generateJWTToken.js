// import jwt from 'jsonwebtoken';

// export default function generateJWTToken(user) {
//     const payload = {
//         id: user._id,
//         email: user.email,
//         phoneNumber1: user.phoneNumber1,
//         role: user.role
//     };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
//     return token;
// }

import jwt from 'jsonwebtoken';

export default function generateJWTToken(user) {
    const payload = {
        id: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
    return token;
}