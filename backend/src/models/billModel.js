const { default: mongoose } = require("mongoose");

const BillSchema = new mongoose.Schema({
    createAt: {
        type: Date,
        default: Date.now(),
    },
    createBy: {
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
        require: 'pending',
    },
    authorId: {
        type: String,
    },
    updateAt: {
        type: Date,
        default: Date.now(),

    }
})

const BillModel = mongoose.model("bill", BillSchema);
module.exports = BillModel;
