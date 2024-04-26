const asyncHandler = require("express-async-handler");
const EventModel = require("../models/eventModel");
const CategoryModel = require("../models/categoryModel");
const { request } = require("express");
const BillModel = require("../models/BillModel");

const nodemailer = require("nodemailer");
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
const searchEvents = asyncHandler(async (req, res) => {
    const { title } = req.query;

    const events = await EventModel.find({});

    const items = events.filter((element) =>
        element.title.toLowerCase().includes(title.toLocaleLowerCase())
    );

    res.status(200).json({
        message: "get events ok",
        data: items,
    });
});
const getEvents = asyncHandler(async (req, res) => {
    const { lat, long, distance, limit, date } = req.query;

    const events = await EventModel.find({})
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

                if (eventDistance < distance) {
                    items.push(event);
                }
            });
        }

        res.status(200).json({
            message: "get events ok",
            data: date
                ? items.filter((element) => element.date > new Date(date))
                : items,
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

    console.log(followers);

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
    const data = req.body

    data.price = parseFloat(data.price)

    const bill = new BillModel(data)
    bill.save()

    res.status(200).json({
        message: "Add new bill",
        data: bill,
    });
})

const handlerUpdatePaymentSuccess = asyncHandler(async (req, res) => {
    const { billId } = req.query

    await BillModel.findByIdAndUpdate(billId, {
        status: 'success',
    })

    const data = {
        from: `"EventHub Team" <${process.env.USERNAME_EMAIL}>`,
        to: 'huyhn045@gmail.com',
        subject: "Your Verification Code for EventHub",
        text: "Your code to verification email",
        html: `
        <html>
        <h1>Your ticket</h1>
        </html>
    `,
    };

    await handlerSendMail(data)

    res.status(200).json({
        message: "Update bill successfully",
        data: [],
    });
})

module.exports = {
    updateEvent,
    addNewEvent,
    getEvents,
    updateFollowers,
    getFollowers,
    createCategory,
    getCategories,
    getEventById,
    searchEvents,
    getEventsByCategoryId,
    handlerAddNewBillDetail,
    handlerUpdatePaymentSuccess
};
