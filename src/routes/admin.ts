import express from "express";
import { authenticate } from "../middlewares/auth";
import { isAdmin } from "../middlewares/authAdmin";
import { handleCreateAdmin, handleGetAdmins } from "../controllers/user-auth";
import {
  createSlotsController,
  getSlotsController,
} from "../controllers/time-slots";
import {
  deleteField,
  getAllField,
  handleCreateField,
  updateField,
} from "../controllers/field";
import { getAllBooking } from "../controllers/booking";

const router = express.Router();

router.get("/admin", authenticate, isAdmin, handleGetAdmins);
router.post("/admin/create", authenticate, isAdmin, handleCreateAdmin);
// field
router.post("/field", authenticate, isAdmin, handleCreateField);
router.get("/field", authenticate, isAdmin, getAllField);
router.put("/field/:id", authenticate, isAdmin, updateField);
router.delete("/field/:id", authenticate, isAdmin, deleteField);

// time
router.post("/timeslot/:fieldId", authenticate, isAdmin, createSlotsController);
router.get("/timeslot/:fieldId", authenticate, isAdmin, getSlotsController);

// booking
router.get("/booking", authenticate, isAdmin, getAllBooking);

export default router;
