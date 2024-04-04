/** @format */

const Router = require("express");
const { register,login,verification,forgottenPassword,handlerLoginWithGoogle } = require("../controllers/authController");

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verification",verification);
authRouter.post("/forgottenPassword",forgottenPassword);
authRouter.post("/google-signin",handlerLoginWithGoogle);



module.exports = authRouter;
