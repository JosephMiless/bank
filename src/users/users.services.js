import { User } from "../models/user.js";

export const findUserByEmail = async (email) => {
  return await User.findAll({ where: { email } });
};

export const createUser = async (data) => {
  return await User.create(data);
};

export const getAllUsers = async () => {
  return await User.findAll();
};