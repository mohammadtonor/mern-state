import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs';
import User from './../models/user.model.js'
import Listing from './../models/listing.model.js'

export const updateUser = async (req , res, next) => {
    const id = req.params.id;
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

export const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    if(req.user.id !== id ) return next(errorHandler(401, "user only can delete your own account"));
    try {
        const user = await User.findByIdAndDelete(id);
        if(!user) return next(errorHandler(404, "User Not found"));
        res.clearCookie("access_token");
        res.status(200).json("User has been deleted!");
    } catch (error) {
        next(error);
    }
}

export const getUserListing = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only see your own listinge"));
    } else {
        try {
            const listing = await Listing.find({userRef: req.params.id});
            res.status(200).json(listing);
        } catch (error) {
            next(errorHandler(error));
        }
    }
}