import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import errorHandler from "../utils/error.js"

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;

    // Hash the password using bcrypt
    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error hashing password" });
        }
        try {
            const newUser = new User({ username, email, password: hash });
            await newUser.save();
            res.status(201).json({message: "Signup successful"});
        } catch (error) {
            //return res.status(500).json({message: error.message});
            //next(errorHandler(500, error.message))
            next(error)
        }
    })
}
