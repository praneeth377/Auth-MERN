import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import errorHandler from "../utils/error.js";
dotenv.config({ path: '../.env' });

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;

    // Check if user already is in db or not
    const userIfExist = await User.findOne({username: username, email: email})
    if (userIfExist) {
        return next(errorHandler(500, 'User already exists. Try signing in.'))
    }

    // Hash the password using bcrypt
    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            console.log(err);
            return next(errorHandler(500, 'Error hashing password'))
        }
        try {
            const newUser = new User({ username, email, password: hash });
            await newUser.save();
            res.status(201).json({message: "Signup successful"});
        } catch (error) {
            //res.status(500).json({message: error.message});
            // return next(errorHandler(500, error.message))
            next(error)
        }
    })
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        const validUser = await User.findOne({email})
        if (!validUser) {
            return next(errorHandler(404, 'User not found'))
        }

        // Compare the hashed password stored in db with password entered
        bcrypt.compare(password, validUser.password, (err, result) => {
            if (err) {
                console.log(err)
                return next(errorHandler(500, 'Error while comparing passwords'))
            } else {
                if (!result) {
                    return next(errorHandler(401, 'Wrong credentials'))
                }
                const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
                const {password: password, ...rest} = validUser._doc
                res
                    .cookie('access_token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'None' })
                    .status(200)
                    .json(rest)
            }
        })
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    const { name, email, photo } = req.body;

    try {
      const userExist = await User.findOne({ email });

      if (userExist) {
        const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { password, ...rest } = userExist._doc;
        return res
          .cookie('access_token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'None' }) // 1 hour expiry
          .status(200)
          .json(rest);

      } else {
        // Create random password for new user and hashing
        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const newUser = new User({
          username: name.split(' ').join('').toLowerCase() + Math.floor(10000 * Math.random()),
          email: email,
          password: hashedPassword,
          profile_pic: photo,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { password, ...rest } = newUser._doc;
        return res
          .cookie('access_token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'None' }) // 1 hour expiry
          .status(200)
          .json(rest);
      }
    } catch (error) {
      next(errorHandler(500, 'An error occurred during the authentication process'));
    }
  };
