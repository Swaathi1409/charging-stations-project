const mongoose = require('mongoose');

const chargingStationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    powerOutput: {
        type: Number,
        required: true,
        min: 0
    },
    connectorType: {
        type: String,
        required: true,
        enum: ['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Create geospatial index
chargingStationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ChargingStation', chargingStationSchema); 