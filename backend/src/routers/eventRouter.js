const Router = require("express");
const {
    addNewEvent,
    getEvents,
    updateFollowers,
    getFollowers,
    createCategory,
    getCategories,
    getEventById,
    updateEvent,
    getEventsByCategoryId,
    handlerAddNewBillDetail,
    handlerUpdatePaymentSuccess,
    updateCategory,
    getCategoryDetail,
    joinEvent,
    getEventsByDate,
} = require("../controllers/eventController");

const eventRouter = Router();

eventRouter.post("/add-new", addNewEvent);
eventRouter.get("/get-events", getEvents);
eventRouter.post("/update-followers", updateFollowers);
eventRouter.get("/followers", getFollowers);
eventRouter.post("/create-category", createCategory);
eventRouter.get("/get-categories", getCategories);
eventRouter.get("/get-event", getEventById);
eventRouter.put("/update-event", updateEvent);
eventRouter.get("/get-events-by-categoryid", getEventsByCategoryId);
eventRouter.post("/buy-ticket", handlerAddNewBillDetail);
eventRouter.get("/update-payment-success", handlerUpdatePaymentSuccess);
eventRouter.put("/update-category", updateCategory);
eventRouter.get("/get-category-detail", getCategoryDetail);
eventRouter.get("/join-event", joinEvent);
eventRouter.get("/get-event-by-date", getEventsByDate);

module.exports = eventRouter;
