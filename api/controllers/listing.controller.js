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

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === false) {
            offer = { $in: [true, false] };
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === false) {
            parking = { $in: [true, false] };
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === false) {
            furnished = { $in: [true, false] };
        }

        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in:  ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || ""

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || "desc"

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i'},
            offer,
            furnished,
            type,
            parking,
            type,
        }).sort(
            {[sort]: order}
        ).limit(limit).skip(startIndex);

        return res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
}