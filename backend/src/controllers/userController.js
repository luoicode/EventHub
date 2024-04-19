const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const { query } = require("express");
const EventModel = require("../models/eventModel");
const http = require("http");

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserModel.find({});

    const data = [];
    users.forEach((item) =>
        data.push({
            email: item.email ?? "",
            name: item.name ?? "",
            id: item.id,
        })
    );

    await handlerSendNotification();

    res.status(200).json({
        message: "Get users successfully!!!",
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
            message: "fafa",
            data: ids,
        });
    } else {
        res.sendStatus(401);
        throw new Error("Missing uid");
    }
});

const updateFcmToken = asyncHandler(async (req, res) => {
    const { uid, fcmTokens } = req.body;

    await UserModel.findByIdAndUpdate(uid, {
        fcmTokens,
    });

    res.status(200).json({
        message: "Fcmtoken updated",
        data: [],
    });
});

const handlerSendNotification = async () => {
    var request = require("request");
    var options = {
        method: "POST",
        url: "https://fcm.googleapis.com/fcm/send",
        headers: {
            "Content-Type": "application/json",
            Authorization:
                "key=AAAAW9HyE-U:APA91bFApLKCmAOWpQIzUwXwK1qDi9lDNJ5qtMty6Ml-bCdG-QV8lLd1g8oBFiQgCqSaeQHa-cCHo8pddUvUj2ymcoWGGGEfDDO2FaVh-PSWofpEvvG_AbgV_zQEvexoOyYvtZ1Ub7sq",
        },
        body: JSON.stringify({
            registration_ids: [
                "cBXAL6sWTnqjp5QuGtuBhe:APA91bFRtGqa4I41dE0D6NcvsNf9PyU4k5Am5Vdji5-FCKNN5NvBNEy3i_H2MkO9Yai__kmWnQ1vaINkBSHaVa0dSynEeQspHW0yBb6EV0OpbAbAv-OeJCoMAbm8DKWsflqcgdVZreWh",
            ],
            notification: {
                title: "title",
                subtitle: "sub title",
                body: "content of message",
                sound: "default",
            },
            contentAvailable: "true",
            priority: "high",
            apns: {
                payload: {
                    aps: {
                        contentAvailable: "true",
                    },
                },
                headers: {
                    "apns-push-type": "background",
                    "apns-priority": "5",
                    "apns-topic": "",
                },
            },
        }),
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
};
const getProfile = asyncHandler(async (req, res) => {
    const { uid } = req.query;

    if (uid) {
        const profile = await UserModel.findOne({ _id: uid });

        res.status(200).json({
            message: "fafa",
            data: {
                uid: profile._id,
                createdAt: profile.createAt,
                updatedAt: profile.updateAt,
                name: profile.name ?? "",
                giveName: profile.givename ?? "",
                familyName: profile.familyName ?? "",
                email: profile.email ?? "",
                photoUrl: profile.photoUrl ?? "",
                bio: profile.bio ?? "",
                following: profile.following ?? [],
                interest: profile.interest ?? [],
            },
        });
    } else {
        res.sendStatus(401);
        throw new Error("Missing uid");
    }
});

const getFollowers = asyncHandler(async (req, res) => {
    const { uid } = req.query;

    if (uid) {
        const users = await UserModel.find({ following: { $all: uid } });

        const ids = [];

        if (users.length > 0) {
            users.forEach((user) => ids.push(user._id));
        }

        res.status(200).json({
            message: "",
            data: ids,
        });
    } else {
        res.sendStatus(404);
        throw new Error("can not find uid");
    }
});

const updateProfile = asyncHandler(async (req, res) => {
    const body = req.body;
    const { uid } = req.query;

    if (uid && body) {
        await UserModel.findByIdAndUpdate(uid, body);

        res.status(200).json({
            message: "Update user successfully!!",
            data: [],
        });
    } else {
        res.sendStatus(401);
        throw new Error("Missing data");
    }
});

const updateInterest = asyncHandler(async (req, res) => {
    const body = req.body;

    const { uid } = req.query;

    if (uid && body) {
        await UserModel.findByIdAndUpdate(uid, {
            interest: body,
        });
        res.status(200).json({
            message: "Update interest successfully!",
            data: body,
        });
    } else {
        res.sendStatus(404);
        throw new Error("Missing data");
    }
});

const toggleFollowing = asyncHandler(async (req, res) => {
    const { uid, authorId } = req.body;
    if (uid && authorId) {
        const user = await UserModel.findById(uid);

        if (user) {
            const { following } = user;

            const items = following ?? []

            const index = following.findIndex(element => element === authorId)
            if (index !== -1) {
                items.splice(index, 1)
            } else {
                items.push(`${authorId}`)
            }


            await UserModel.findByIdAndUpdate(uid, {
                following: items
            })

            res.status(200).json({
                message: "Update following successfully!",
                data: items,
            });
        } else {
            res.sendStatus(404);
            throw new Error("User or Author not found!");
        }
    } else {
        res.sendStatus(404);
        throw new Error("Missing data!");
    }
});
const getFollowing = asyncHandler(async (req, res) => {
    const { uid } = req.query;

    if (uid) {
        const user = await UserModel.findById(uid)

        res.status(200).json({
            message: "",
            data: user.following,
        });
    } else {
        res.sendStatus(404);
        throw new Error("can not find uid");
    }
});
module.exports = {
    getAllUsers,
    getEventsFollowed,
    updateFcmToken,
    getProfile,
    getFollowers,
    updateProfile,
    updateInterest,
    toggleFollowing,
    getFollowing
};
