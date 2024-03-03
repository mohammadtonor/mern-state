import { errorHandler } from '../utils/error.js';
import Listing from './../models/listing.model.js'

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async (req, res, next) => {
     
    const listing = await Listing.findById(req.params.id);
    
    if(!listing) return next(errorHandler(404, "Listing Not found"));
    
    if (req.user.id !== listing.userRef){
        return next(errorHandler(401, "You dont have permission to delete this item!"));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(201).json("Listing has been deleted!");
    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req, res, next) => {
    
    try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) { 
        return next(errorHandler(401, 'You can only update your own listings!'));
    }

        const updateListing = req.body;
 
        const newListing = await Listing.findByIdAndUpdate(
            req.params.id,
            updateListing,
            { new: true}
        );

        res.status(201).json(newListing);
    } catch (error) {
        next(error);
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}