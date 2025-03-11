const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAuthenticated,isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");

const router = express.Router();

// Create Event
router.post(
  "/create-event", catchAsyncErrors(async (req, res, next) => {
    console.log('Create event route hit');
    const { shopId, images, ...eventData } = req.body;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    const imagesLinks = [];
    for (const image of images) {
      const result = await cloudinary.v2.uploader.upload(image, { folder: "events" });
      imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
    }

    const event = await Event.create({
      ...eventData,
      images: imagesLinks,
      shopId,
      shop,
      bidding: {
        currentHighestBid: 0, // Set initial bid to 0
      }
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  })
);
// Place Bid
router.post(
  "/place-bid/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { bidAmount } = req.body;

    if (!bidAmount || bidAmount <= 0) {
      return next(new ErrorHandler("Invalid bid amount", 400));
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    // Check if bidding is open
    if (new Date() > new Date(event.Finish_Date)) {
      return next(new ErrorHandler("Bidding has ended for this event", 400));
    }

    // Validate bid amount
    if (bidAmount <= event.currentHighestBid) {
      return next(new ErrorHandler("Bid amount is too low", 400));
    }

    // Add bid to the event
    const newBid = {
      userId: req.user._id,
      bidAmount,
      bidTime: Date.now(),
    };

    // Push the new bid into the bids array (ensure it's a valid document)
    event.bids.push(newBid);

    // Update current highest bid
    event.currentHighestBid = bidAmount;

    // Save the event with updated bid and current highest bid
    await event.save();

    res.status(200).json({
      success: true,
      message: "Bid placed successfully",
      currentHighestBid: event.currentHighestBid,
    });
  })
);


// Accept Bid (Seller Only)
router.post(
  "/accept-bid/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const { bidId } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    // Ensure the seller owns the event
    if (event.shopId.toString() !== req.user.shopId.toString()) {
      return next(new ErrorHandler("Unauthorized action", 403));
    }

    // Find the selected bid
    const selectedBid = event.bids.find((bid) => bid._id.toString() === bidId);
    if (!selectedBid) {
      return next(new ErrorHandler("Bid not found", 404));
    }

    // Mark the bid as accepted
    event.bidding.winningBid = selectedBid;

    await event.save();

    res.status(200).json({
      success: true,
      message: "Bid accepted successfully",
      winningBid: event.bidding.winningBid,
    });
  })
);

// Get All Bids for an Event (Seller Only)
router.get(
  "/get-bids/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    res.status(200).json({
      success: true,
      bids: event.bids,
    });
  })
);

// Delete Event (Seller Only)
router.delete(
  "/delete-event/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    // Ensure the seller owns the event
    if (event.shopId.toString() !== req.user.shopId.toString()) {
      return next(new ErrorHandler("Unauthorized action", 403));
    }

    // Remove images from Cloudinary
    for (const image of event.images) {
      await cloudinary.v2.uploader.destroy(image.public_id);
    }

    await event.remove();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  })
);

// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get all events of a shop
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete event of a shop
router.delete(
  "/delete-shop-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }    

      for (let i = 0; 1 < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          event.images[i].public_id
        );
      }
    
      await event.remove();

      res.status(201).json({
        success: true,
        message: "Event Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all events --- for admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



module.exports = router;
