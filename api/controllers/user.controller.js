import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs';
import User from './../models/user.model.js'

export const test = (req , res) => {
    res.json({
        message: 'Api route test work'
    })
}

export const updateUser = async (req , res, next) => {
    const id = req.params.id;
    console.log(req.user, id);
    if(req.user.id !== id) return next(errorHandler(401, "You can update your own profile"))
    try {
        let hashedPassword;
        if(req.body.password) {
            hashedPassword = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.avatar
            }
        }, {new: true});

        const {password, ...rest} = updatedUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);   
    }
}