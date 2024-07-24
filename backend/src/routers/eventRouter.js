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
    deleteEvent,
    getEventsWithFollowers,
    getSuccessBills,
    handlerUpdateBillQuantity,
    // addCategory,
    sendMailReview,
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
eventRouter.delete("/delete-event", deleteEvent);
eventRouter.get("/events-with-followers", getEventsWithFollowers);
eventRouter.get('/success-bills', getSuccessBills);
eventRouter.post('/update-quantity', handlerUpdateBillQuantity);
eventRouter.post('/send-mail-review', sendMailReview);
// eventRouter.post('/add-category-new', addCategory);

module.exports = eventRouter;
