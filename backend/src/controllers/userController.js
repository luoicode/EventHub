const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');
const { query } = require('express');
const EventModel = require('../models/eventModel');
const http = require('http')

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserModel.find({});

    const data = [];
    users.forEach((item) =>
        data.push({
            email: item.email ?? '',
            name: item.name ?? '',
            id: item.id,
        })
    );

    await handlerSendNotification();

    res.status(200).json({
        message: 'Get users successfully!!!',
        data,
    });
});

const getEventsFollowed = asyncHandler(async (req, res) => {
    const { uid } = req.query;

    if (uid) {
        const events = await EventModel.find({ followers: { $all: uid } });

        const ids = [];

        events.forEach((event) => ids.push(event.id));

        res.status(200).json({
            message: 'fafa',
            data: ids,
        });
    } else {
        res.sendStatus(401);
        throw new Error('Missing uid');
    }
});


const updateFcmToken = asyncHandler(async (req, res) => {
    const { uid, fcmTokens } = req.body


    await UserModel.findByIdAndUpdate(uid, {
        fcmTokens
    })

    res.status(200).json({
        message: 'Fcmtoken updated',
        data: [],
    })
})

const handlerSendNotification = async () => {
    var request = require('request');
    var options = {
        method: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
            'Content-Type': 'application/json',
            Authorization:
                'key=AAAAW9HyE-U:APA91bFApLKCmAOWpQIzUwXwK1qDi9lDNJ5qtMty6Ml-bCdG-QV8lLd1g8oBFiQgCqSaeQHa-cCHo8pddUvUj2ymcoWGGGEfDDO2FaVh-PSWofpEvvG_AbgV_zQEvexoOyYvtZ1Ub7sq',
        },
        body: JSON.stringify({
            registration_ids: [
                'cBXAL6sWTnqjp5QuGtuBhe:APA91bFRtGqa4I41dE0D6NcvsNf9PyU4k5Am5Vdji5-FCKNN5NvBNEy3i_H2MkO9Yai__kmWnQ1vaINkBSHaVa0dSynEeQspHW0yBb6EV0OpbAbAv-OeJCoMAbm8DKWsflqcgdVZreWh',
            ],
            notification: {
                title: 'title',
                subtitle: 'sub title',
                body: 'content of message',
                sound: 'default',
            },
            contentAvailable: 'true',
            priority: 'high',
            apns: {
                payload: {
                    aps: {
                        contentAvailable: 'true',
                    },
                },
                headers: {
                    'apns-push-type': 'background',
                    'apns-priority': '5',
                    'apns-topic': '',
                },
            },
        }),
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
};


module.exports = { getAllUsers, getEventsFollowed, updateFcmToken };