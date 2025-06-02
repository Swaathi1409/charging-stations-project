const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const ChargingStation = require('../models/ChargingStation');

// Get all charging stations
router.get('/', auth, async (req, res) => {
    try {
        const stations = await ChargingStation.find()
            .populate('createdBy', 'name email');
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new charging station
router.post('/', [
    auth,
    body('name').notEmpty().withMessage('Name is required'),
    body('location.coordinates').isArray().withMessage('Location coordinates must be an array'),
    body('location.coordinates').custom((value) => {
        if (value.length !== 2) {
            throw new Error('Location must have latitude and longitude');
        }
        return true;
    }),
    body('powerOutput').isNumeric().withMessage('Power output must be a number'),
    body('connectorType').isIn(['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla'])
        .withMessage('Invalid connector type')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        console.log('Incoming station data:', req.body);

        const station = new ChargingStation({
            ...req.body,
            createdBy: req.user._id
        });

        await station.save();
        res.status(201).json(station);
    } catch (error) {
        console.error('Error creating station:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update charging station
router.put('/:id', [
    auth,
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('location.coordinates').optional().isArray().withMessage('Location coordinates must be an array'),
    body('powerOutput').optional().isNumeric().withMessage('Power output must be a number'),
    body('connectorType').optional().isIn(['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla'])
        .withMessage('Invalid connector type')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const station = await ChargingStation.findById(req.params.id);
        if (!station) {
            return res.status(404).json({ message: 'Charging station not found' });
        }

        // Check if user is the creator or an admin
        if (station.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(station, req.body);
        await station.save();
        res.json(station);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete charging station
router.delete('/:id', auth, async (req, res) => {
    try {
        const station = await ChargingStation.findById(req.params.id);
        if (!station) {
            return res.status(404).json({ message: 'Charging station not found' });
        }

        // Check if user is the creator or an admin
        if (station.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await station.deleteOne();
        res.json({ message: 'Charging station deleted' });
    } catch (error) {
        console.error('Error deleting station:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get nearby charging stations
router.get('/nearby', auth, async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 10000 } = req.query;

        if (!longitude || !latitude) {
            return res.status(400).json({ message: 'Longitude and latitude are required' });
        }

        const stations = await ChargingStation.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        }).populate('createdBy', 'name email');

        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 