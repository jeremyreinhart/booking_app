import express from "express";
import { authenticate } from "../middlewares/auth";
import {
  handleLoginUser,
  handleRegisterUser,
  userLogin,
  userLogout,
} from "../controllers/user-auth";
import {
  createBooking,
  getUserBooking,
  userCancelBooking,
} from "../controllers/booking";
import { isUser } from "../middlewares/authUser";
import { getAllField, getDetailField } from "../controllers/field";
import { getSlotsController } from "../controllers/time-slots";
import { checkReviewEligibility, createReview } from "../controllers/rating";
import { getHeroStats } from "../controllers/stats";

const router = express.Router();

router.post("/user/register", handleRegisterUser);
router.post("/user/login", handleLoginUser);
router.get("/me", authenticate, userLogin);
router.post("/user/logout", authenticate, userLogout);

// booking
router.get("/detail-booking", authenticate, getUserBooking);
router.post("/booking", authenticate, isUser, createBooking);
router.patch("/booking/:id/cancel", authenticate, isUser, userCancelBooking);

//field
router.get("/field", getAllField);
router.get("/field/:id", getDetailField);

//time
router.get("/timeslot/:fieldId", getSlotsController);

//rating
router.post("/review", authenticate, createReview);
router.get(
  "/review/check-eligibility/:fieldId",
  authenticate,
  checkReviewEligibility,
);

// Hero Stats
router.get("/stats/hero", getHeroStats);

export default router;
