const asyncHandler = require("express-async-handler");
const EventModel = require("../models/eventModel");
const CategoryModel = require("../models/categoryModel");
const { request } = require("express");
const BillModel = require("../models/billModel");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const nodemailer = require("nodemailer");
const UserModel = require("../models/userModel");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.USERNAME_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
const handlerSendMail = async (val) => {
    try {
        await transporter.sendMail(val);

        return "OK";
    } catch (error) {
        return error;
    }
};

const calcDistanceLocation = ({
    currentLat,
    curentLong,
    addressLat,
    addressLong,
}) => {
    const r = 6371;
    const dLat = toRoad(addressLat - currentLat);
    const dLon = toRoad(addressLong - curentLong);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(toRoad(currentLat)) *
        Math.cos(toRoad(addressLat));
    return r * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};
const toRoad = (val) => (val * Math.PI) / 180;

const addNewEvent = asyncHandler(async (req, res) => {
    const body = req.body;
    const data = { ...body }
    data.price = parseFloat(body.price)

    if (body) {
        const newEvent = new EventModel(body);

        await newEvent.save();

        res.status(200).json({
            message: "Add new Event successfully!!!",
            data: newEvent,
        });
    } else {
        res.status(401);
        throw new Error("Event data not found!!!");
    }
});

const getEventById = asyncHandler(async (req, res) => {
    const { id } = req.query;

    const item = await EventModel.findById({ _id: id });

    res.status(200).json({
        message: "Event detail",
        data: item,
    });
});



const getEvents = asyncHandler(async (req, res) => {
    const { lat, long, distance, limit, date, categoryId, startAt, endAt, isUpcoming, isPastEvents, title, minPrice, maxPrice } = req.query;
    const filter = {};
    if (categoryId) {
        if (categoryId.includes(',')) {

            const values = []


            categoryId.split(',').forEach(id => values.push({
                categories: { $eq: id }
            }))

        } else {

            filter.categories = { $eq: categoryId }
        }
    }
    if (startAt && endAt) {
        filter.startAt = { $gt: new Date(startAt).getTime() }
        filter.endAt = { $lt: new Date(endAt).getTime() }
    }



    if (isUpcoming) {
        filter.startAt = { $gt: Date.now() }
    }
    if (isPastEvents) {
        filter.endAt = { $lt: Date.now() }
    }

    if (title) {
        filter.title = { $regex: title }
    }

    if (maxPrice && minPrice) {
        filter.price = { $lte: parseInt(maxPrice), $gte: parseFloat(minPrice) }
    }

    if (date) {
        const selectedDate = new Date(date);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);

        filter.startAt = { $gte: selectedDate, $lt: nextDay };
    }

    const events = await EventModel.find(filter)
        .sort({ createAt: -1 })
        .limit(limit ?? 0);

    if (lat && long && distance) {
        const items = [];
        if (events.length > 0) {
            events.forEach((event) => {
                const eventDistance = calcDistanceLocation({
                    curentLong: long,
                    currentLat: lat,
                    addressLat: event.position.lat,
                    addressLong: event.position.long,
                });

                if (eventDistance < parseFloat(distance)) {
                    items.push(event);
                }
            });
        }

        res.status(200).json({
            message: "get events ok",
            data: items,
        });
    } else {
        res.status(200).json({
            message: "get events ok",
            data: date
                ? events.filter((element) => element.date >= new Date(date))
                : events,
        });
    }
});

const updateFollowers = asyncHandler(async (req, res) => {
    const body = req.body;
    const { id, followers } = body;

    await EventModel.findByIdAndUpdate(id, { followers, updatedAt: Date.now() });

    res.status(200).json({
        mess: "Update followers successfully! ",
        data: [],
    });
});

const getFollowers = asyncHandler(async (req, res) => {
    const { id } = req.query;

    const event = await EventModel.findById(id);

    if (event) {
        res.status(200).json({
            mess: "Followers",
            data: event.followers ?? [],
        });
    } else {
        res.status(401);
        throw new Error("Event not found");
    }
});

const getEventsWithFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.query;

    const user = await UserModel.findById(userId);

    if (user) {
        const followerEvents = await EventModel.find({ followers: userId });

        res.status(200).json({
            message: "Events with followers retrieved successfully",
            data: followerEvents,
        });
    } else {
        res.status(401).json({ message: "User not found" });
    }
});



const createCategory = asyncHandler(async (req, res) => {
    const data = req.body;

    const newCategory = new CategoryModel(data);

    newCategory.save();

    res.status(200).json({
        message: "Add new category successfully!",
        data: newCategory,
    });
});

const getCategories = asyncHandler(async (req, res) => {
    const items = await CategoryModel.find({});

    res.status(200).json({
        message: "get category successfully!",
        data: items,
    });
});

const joinEvent = asyncHandler(async (req, res) => {
    const { uid, eventId } = req.query

    const itemEvent = await EventModel.findById(eventId)

    const joined = itemEvent.joined ? itemEvent.joined : []

    if (joined.includes(uid)) {
        const index = joined.findIndex(element => element === uid)
        joined.splice(index, 1)
    } else {
        joined.push(uid)
    }

    await EventModel.findByIdAndUpdate(eventId, {
        joined
    })

    res.status(200).json({
        message: "uasc!",
        data: [],
    });
})

const updateEvent = asyncHandler(async (req, res) => {
    const data = req.body;
    const { id } = req.query;
    const item = await EventModel.findByIdAndUpdate(id, data);
    res.status(200).json({
        message: "update events successfully!",
        data: item,
    });
});
const getEventsByCategoryId = asyncHandler(async (req, res) => {
    const { id } = req.query;

    const items = await EventModel.find({ categories: { $all: id } });
    res.status(200).json({
        message: "get events by category successfully!",
        data: items,
    });
});

const handlerAddNewBillDetail = asyncHandler(async (req, res) => {
    const data = req.body;
    data.price = parseFloat(data.price)
    const bill = new BillModel(data);
    bill.save();

    res.status(200).json({
        message: 'Add new bill info successfully',
        data: bill,
    });
});

const handlerUpdatePaymentSuccess = asyncHandler(async (req, res) => {
    const { billId } = req.query;

    try {
        // Cập nhật trạng thái hóa đơn thành công
        await BillModel.findByIdAndUpdate(billId, {
            status: 'success',
        });

        // Tạo mã QR code ngẫu nhiên
        const qrCode = uuidv4();

        // Lưu mã QR code vào hóa đơn
        const updatedBill = await BillModel.findByIdAndUpdate(billId, {
            qrCode: qrCode,
        }, { new: true });

        // Tạo hình ảnh QR code dưới dạng base64
        const qrCodeBase64 = await QRCode.toDataURL(qrCode);

        // Gửi email chứa mã QR code đến người dùng
        const data = {
            from: `"Support EventHub Appplication" <${process.env.USERNAME_EMAIL}>`,
            to: 'huyhn045@gmail.com', // Thay bằng email người dùng
            subject: 'Your Ticket QR Code',
            html: `
                <h1>Your ticket QR code</h1>
                <p>Thank you for your payment. Below is your ticket QR code:</p>
                <img src="${qrCodeBase64}" alt="QR Code" />
            `,
        };

        await handlerSendMail(data);

        res.status(200).json({
            message: 'Update bill successfully and sent email with QR code',
            data: updatedBill,
        });
    } catch (error) {
        console.error('Error updating bill and sending email:', error);
        res.status(500).json({
            message: 'Error updating bill and sending email',
            error: error.message,
        });
    }
});


const getSuccessBills = asyncHandler(async (req, res) => {
    const { userId } = req.query;

    try {
        const successBills = await BillModel.find({ status: 'success', createdBy: userId });
        if (!successBills || successBills.length === 0) {
            return res.status(404).json({
                message: 'No successful bills found',
                data: [],
            });
        }

        res.status(200).json({
            message: 'Successfully fetched successful bills',
            data: successBills,
        });
    } catch (err) {
        console.error('Error fetching successful bills:', err);
        res.status(500).json({
            message: 'Error fetching successful bills',
            error: err.message,
        });
    }
});




const updateCategory = asyncHandler(async (req, res) => {
    const data = req.body;
    const { id } = req.query;
    const item = await CategoryModel.findByIdAndUpdate(id, data);
    res.status(200).json({
        message: "update category successfully!",
        data: item,
    });
})

const getCategoryDetail = asyncHandler(async (req, res) => {
    const { id } = req.query;
    const item = await CategoryModel.findById(id);
    res.status(200).json({
        message: "get category successfully!",
        data: item,
    });
})
const deleteEvent = async (req, res) => {
    const { id } = req.query; // Lấy id của sự kiện từ query params

    // Kiểm tra xem sự kiện có tồn tại không
    const event = await EventModel.findById(id);

    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    // Xóa sự kiện
    await EventModel.deleteOne({ _id: id });

    return res.status(200).json({ message: "Event deleted successfully" });
};


module.exports = {
    updateEvent,
    addNewEvent,
    getEvents,
    updateFollowers,
    getFollowers,
    createCategory,
    getCategories,
    getEventById,
    getEventsByCategoryId,
    handlerAddNewBillDetail,
    handlerUpdatePaymentSuccess,
    updateCategory,
    getCategoryDetail,
    joinEvent,
    deleteEvent,
    getEventsWithFollowers,
    getSuccessBills
};
