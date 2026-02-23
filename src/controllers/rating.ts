import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { prisma } from "../prisma/client";
import { AppError } from "../errors/AppError";

export const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = req.user?.id;

    if (!rating || rating < 1 || rating > 5) {
      return next(new AppError("Rating must be between 1 and 5", 400));
    }

    // Cari Booking & Validasi (Milik User & Status CONFIRMED)
    const booking = await prisma.booking.findFirst({
      where: {
        id: Number(bookingId),
        userId: Number(userId),
        status: "CONFIRMED",
      },
      include: { review: true },
    });

    if (!booking) {
      return next(new AppError("Booking not found or not yet confirmed", 404));
    }

    // Cek apakah booking ini sudah pernah di-review
    if (booking.review) {
      return next(new AppError("This booking has already been reviewed", 400));
    }

    const newReview = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        userId: Number(userId),
        fieldId: booking.fieldId,
        bookingId: booking.id,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Thank you for your review!",
      data: newReview,
    });
  } catch (error) {
    console.error(error);
    next(new AppError("Internal Server Error", 500));
  }
};

export const checkReviewEligibility = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { fieldId } = req.params;

    // Cari booking terakhir milik user di lapangan ini yang statusnya CONFIRMED
    // dan BELUM memiliki review
    const booking = await prisma.booking.findFirst({
      where: {
        fieldId: Number(fieldId),
        userId: Number(userId),
        status: "CONFIRMED",
        review: null, // Hanya ambil yang belum direview
      },
      orderBy: { createdAt: "desc" }, // Ambil yang paling baru
    });

    res.status(200).json({
      status: "success",
      data: {
        eligible: !!booking,
        bookingId: booking ? booking.id : null,
      },
    });
  } catch (error) {
    next(new AppError("Failed to check eligibility", 500));
  }
};
