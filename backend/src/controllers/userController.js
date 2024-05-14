const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const EventModel = require("../models/eventModel");
const { JWT } = require('google-auth-library')
const axios = require('axios')
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

const getAccessToken = () => {
    return new Promise(function (resolve, reject) {
        const key = require('../eventhub-accesstoken.json');
        const jwtClient = new JWT(
            key.client_email,
            null,
            key.private_key,
            ['https://www.googleapis.com/auth/cloud-platform'],
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}

const handlerSendNotification = async ({ token, title, subtitle, body, data }) => {
    const accesstoken = await getAccessToken();

    console.log(accesstoken)
    const axios = require('axios')
    let newdata = JSON.stringify({
        message: {
            token,
            notfication: {
                title,
                body,
            },
            data,
        }
    });
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://fcm.googleapis.com/v1/projects/eventhub-ed7f7/messages:send",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accesstoken}`,

        },
        data: newdata,
    };

    await axios
        .request(config)
        .then((reponse) => {
        })
        .catch((error) => {
            console.log(error)
        })
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

const pushInviteNotification = asyncHandler(async (req, res) => {

    const { ids, eventId } = req.body;

    ids.forEach(async (id) => {
        const user = await UserModel.findById(id)

        const fcmTokens = user.fcmTokens

        if (fcmTokens > 0) {
            fcmTokens.forEach(async token => await handlerSendNotification({
                fcmTokens: token,
                title: 'asd',
                subtitle: '',
                body: 'You have been invited to participate in the event!',
                data: {
                    eventId,
                }
            }))

        } else {
            //send mail
            const data = {
                from: `"EventHub Team" <${process.env.USERNAME_EMAIL}>`,
                to: email,
                subject: "Your Verification Code for EventHub",
                text: "Your code to verification email",
                html: `
                <html>
                    <head>
                        <style>
                            body {
                                background-color: #212429;
                                color: #ffffff;
                                font-family: Arial, sans-serif;
                            }
                            .container {
                                padding: 20px;
                                text-align: center;
                            }
                            img {
                                max-width: 200px;
                                height: auto;
                                margin-bottom: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <img src="https://i.imgur.com/kPChuuE.png" alt="EventHub Logo">
                            <h2>Dear User,</h2>
                            <p><strong>${eventId}</strong></p>
                            <p>Best regards,<br>The EventHub Team</p>
                        </div>
                    </body>
                </html>
            `,
            };

            await handlerSendMail(data);
        }
    })

    res.status(200).json({
        message: "asds",
        data: [],
    });

});

const pushNotification = asyncHandler(async (req, res) => {

    const { title, body, data } = req.body

    await handlerSendNotification({
        token: 'cuY-FnV-RjiDcejQhyZXBw:APA91bEBKU0H7DO3mD-Em7IFUsKUOfDfCNl2D3oBAJhSKPIgABuggUVqMqfTaCjGRIapvnyF0B1IYPH0cNK_PoACaXnE6eLpmWBVPjpVXOiyYRu5Ph8UgkwZebmjDeMkXFErMDagdN9C',
        data,
        title,
        body,
    })

    res.status(200).json({
        message: 'asdasd',
        data: [],
    })

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
    getFollowing,
    pushInviteNotification,
    pushNotification
};
