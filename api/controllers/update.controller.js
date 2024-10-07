const User =  require("../models/user.model.js")
const bcrypt = require("bcrypt")
const { errorHandler } = require("../utils/error.js")

exports.update = async (req, res, next) => {
    if (req.user.id != req.params.id) {
        return next(errorHandler(401, 'You can update only your account!'))
    }

    try {
        let hashedPassword = undefined
        if (req.body.password) {
            hashedPassword = await bcrypt.hash(req.body.password, 10)
        }

        let updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profile_pic: req.body.profile_pic
            }
        }, {new: true})

        if (hashedPassword) {
            updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    password: hashedPassword
                }
            }, {new: true})
        }
        const {password, ...rest} = updateUser._doc
        res.status(200).json(rest)

        } catch (error) {
            next(error)
        }
    }
