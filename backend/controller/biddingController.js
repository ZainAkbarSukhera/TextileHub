// Import necessary modules
const express = require('express');
const router = express.Router();
const BiddingEvent = require('../model/bidding');

// Create a Bidding Event
router.post('/create-bidding', async (req, res) => {
    try {
        const biddingEvent = new BiddingEvent(req.body);
        await biddingEvent.save();
        res.status(201).send(biddingEvent);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get Active Bidding Events
router.get('/getbidding', async (req, res) => {
    try {
        const biddingEvents = await BiddingEvent.find();
        res.status(200).send(biddingEvents);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Submit a Bid
router.post('/bidding/:id/bid', async (req, res) => {
    const { id } = req.params;
    const { bidAmount } = req.body;

    try {
        const biddingEvent = await BiddingEvent.findById(id);
        if (!biddingEvent) {
            return res.status(404).send({ message: 'Bidding event not found' });
        }
        if (bidAmount < biddingEvent.minimumBidAmount) {
            return res.status(400).send({ message: 'Bid amount must be higher than the minimum bid amount' });
        }
        // Logic to save the bid (you may need a separate Bid model)
        // For now, just respond with a success message
        res.status(200).send({ message: 'Bid submitted successfully', bidAmount });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Export the router
module.exports = router;



// Create a Bidding Event
