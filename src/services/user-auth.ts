import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";
import { signToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
};

export const registerAdmin = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: "ADMIN" },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
};

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) throw new Error("Email and password are required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("User not found", 400);

  if (!user.password) throw new Error("User has no password set");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Wrong Password", 400);

  const token = signToken({
    id: user.id,
    role: user.role,
  });
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};

export const getUserLogin = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) throw new AppError("User not found", 400);
  return {
    user,
  };
};
