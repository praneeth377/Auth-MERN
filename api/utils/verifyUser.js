import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import errorHandler from './error.js';
dotenv.config({ path: '../.env' });

export const verifyToken = (req, res, next) => {
    console.log('All headers:', req.headers);
    console.log('Cookie header:', req.headers.cookie);
    console.log('Parsed cookies:', req.cookies);
    const token = req.cookies.access_token
    //console.log(token)

    if (!token) return next(errorHandler(401, 'You need to Login'))

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, 'Token is not valid'))

        req.user = user
        next()
    })
}
