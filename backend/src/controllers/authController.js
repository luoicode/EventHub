const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
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

const getJsonWebToken = async (email, id) => {
  const payload = {
    email,
    id,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

const handlerSendMail = async (val) => {
  try {
    await transporter.sendMail(val);

    return "OK";
  } catch (error) {
    return error;
  }
};

const verification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const verificationCode = Math.round(1000 + Math.random() * 9000);

  try {
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
                  <p>Your verification code for EventHub is: <strong>${verificationCode}</strong></p>
                  <p>If you didn't initiate this request, please take necessary actions to secure your EventHub account.</p>
                  <p>Best regards,<br>The EventHub Team</p>
              </div>
          </body>
      </html>
  `,
    };

    await handlerSendMail(data);

    res.status(200).json({
      message: "Send verification code successfully!!!",
      data: {
        code: verificationCode,
      },
    });
  } catch (error) {
    res.status(401);
    throw new Error("Can not send email");
  }
});

const register = asyncHandler(async (req, res) => {
  const { email, fullname, password } = req.body;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    res.status(400).json({
      message: "User has already exist!!!",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new UserModel({
    email,
    fullname: fullname ?? "",
    password: hashedPassword,
  });
  await newUser.save();
  res.status(200).json({
    message: "Register new user successfully",
    data: {
      email: newUser.email,
      id: newUser.id,
      accesstoken: await getJsonWebToken(email, newUser.id),
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await UserModel.findOne({ email });
  if (!existingUser) {
    res.status(403).json({
      message: "User not found!!!",
    });
  }
  const isMatchPassword = await bcrypt.compare(password, existingUser.password);
  if (!isMatchPassword) {
    res.status(401).json({
      message: "Email or Password is not correct!",
    });
  }
  res.status(200).json({
    message: "Login successfully",
    data: {
      id: existingUser.id,
      email: existingUser.email,
      accesstoken: await getJsonWebToken(email, existingUser.id),
      fcmTokens: existingUser.fcmTokens ?? [],
      photo: existingUser.photURL ?? '',
      name: existingUser.name ?? '',
    },
  });
});

const forgottenPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const randomPassword = Math.round(100000 + Math.random() * 99000);

  const data = {
    from: `"EventHub Team" <${process.env.USERNAME_EMAIL}>`,
    to: email,
    subject: "Your New Password for EventHub",
    text: "Your new password for EventHub",
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
                <p>Your new password for EventHub is: <strong>${randomPassword}</strong></p>
                <p>If you didn't initiate this request, please take necessary actions to secure your EventHub account.</p>
                <p>Best regards,<br>The EventHub Team</p>
            </div>
        </body>
    </html>
`,
  };

  const user = await UserModel.findOne({ email });
  if (user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(`${randomPassword}`, salt);

    await UserModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      isChangePassword: true,
    })
      .then(() => {
        console.log("Done");
      })
      .catch((error) => console.error(error));
    await handlerSendMail(data)
      .then(() => {
        res.status(200).json({
          message: "Send new password successfully!!!",
          data: [],
        });
      })
      .catch((error) => {
        res.status(401);
        throw new Error("Can not send email");
      });
  } else {
    res.status(401);
    message: "Coundn't find your account !!!";
  }
});

const handlerLoginWithGoogle = asyncHandler(async (req, res) => {
  const userInfo = req.body;

  const existingUser = await UserModel.findOne({ email: userInfo.email });
  let user = { ...userInfo };
  if (existingUser) {
    await UserModel.findByIdAndUpdate(existingUser.id, {
      ...userInfo,
      updatedAt: Date.now(),
    });
    user.accesstoken = await getJsonWebToken(userInfo.email, userInfo.id);
  } else {
    const newUser = new UserModel({
      email: userInfo.email,
      fullname: userInfo.name,
      ...userInfo,
    });
    await newUser.save();

    user.accesstoken = await getJsonWebToken(userInfo.email, newUser.id);
  }

  res.status(200).json({
    message: 'Login with google successfully!!!',
    data: user,
  });
});

module.exports = {
  register,
  login,
  verification,
  forgottenPassword,
  handlerLoginWithGoogle,
};
