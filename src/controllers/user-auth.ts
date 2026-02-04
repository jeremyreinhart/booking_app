import { NextFunction, Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "../validation/userAuth";
import {
  getUserLogin,
  loginUser,
  registerAdmin,
  registerUser,
} from "../services/user-auth";
import { AuthRequest } from "../middlewares/auth";
import { AppError } from "../errors/AppError";

export const handleRegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = RegisterSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error?.details.reduce(
        (acc: Record<string, string>, detail) => {
          const key = detail.path[0] as string;
          acc[key] = detail.message;
          return acc;
        },
        {},
      );
      return res.status(400).json({
        code: 400,
        success: false,
        message: errors,
      });
    }

    const { name, email, password } = value;
    const user = await registerUser(name, email, password);
    res.status(201).json({
      status: "success",
      message: "Register Successfull",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to Register User", 500));
    }
  }
};

export const handleCreateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error } = RegisterSchema.validate(req.body);
    if (error)
      return res
        .status(500)
        .json({ status: "error", message: "Invalid Register Admin" });

    const { name, email, password } = req.body;
    const admin = await registerAdmin(name, email, password);

    res.status(201).json({
      status: "success",
      message: "Register Admin Successfull",
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        created_at: admin.created_at,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to Create Admin", 500));
    }
  }
};

export const handleLoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = LoginSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error?.details.reduce(
        (acc: Record<string, string>, detail) => {
          const key = detail.path[0] as string;
          acc[key] = detail.message;
          return acc;
        },
        {},
      );
      return res.status(400).json({
        code: 400,
        success: false,
        message: errors,
      });
    }

    const { email, password } = value;
    const user = await loginUser(email, password);

    res.cookie("token", user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Login Successfull",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to Login User", 500));
    }
  }
};

export const userLogin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await getUserLogin(req.user.id);
    res.json({ data: user });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to Login User", 500));
    }
  }
};

export const userLogout = (req: Request, res: Response, next: NextFunction) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout Berhasil" });
};
