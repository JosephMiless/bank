import { BankAccount } from "../models/bankAccount.js";
import { User } from "../models/user.js";

export const findUserByEmailOrID = async (attribute) => {
  return await User.findOne({where: attribute});
};

export const findUserProfileByEmailOrID = async (attribute) => {
  return await User.findOne({where: attribute, include: [
                {model: BankAccount, as: "bankAccounts"}
            ]});
};

export const createUser = async (data) => {
  return await User.create(data);
};

export const getAllUsers = async () => {
  return await User.findAll();
};

export const updateUserProfile = async (attributes, id) => {
  return await User.update(attributes, {where: {id}});
};