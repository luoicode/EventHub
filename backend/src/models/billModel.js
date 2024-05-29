const { default: mongoose } = require('mongoose');

const BillSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    createdBy: {
        type: String,
        require: true,
    },
    eventId: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
    authorId: {
        type: String,
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    title: {
        type: String,
        required: true,
    },
    locationTitle: {
        type: String,
        required: true,
    },
    photoUrl: {
        type: String,
    },
    startAt: {
        type: Number,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    },
});

const BillModel = mongoose.model('bills', BillSchema);
module.exports = BillModel;