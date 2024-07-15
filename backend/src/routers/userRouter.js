const Router = require("express");
const {
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
} = require("../controllers/userController");

const userRouter = Router();

userRouter.get("/get-all", getAllUsers);
userRouter.get("/get-followed-events", getEventsFollowed);
userRouter.post("/update-fcmtoken", updateFcmToken);
userRouter.get("/get-profile", getProfile);
userRouter.get("/get-followers", getFollowers);
userRouter.put("/update-profile", updateProfile);
userRouter.put("/update-interest", updateInterest);
userRouter.put("/update-following", toggleFollowing);
userRouter.get("/get-following", getFollowing);
userRouter.post("/send-invite", pushInviteNotification);



module.exports = userRouter;
