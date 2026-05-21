import exp from "express";
import { UserModel } from "../models/userModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const userApp = exp();

//Get all users (ADMIN only)
userApp.get("/users", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    //get all users excluding passwords
    const users = await UserModel.find({}, { password: 0 });
    res.status(200).json({ message: "Users fetched", payload: users });
  } catch (err) {
    next(err);
  }
});

//Get single user by id (ADMIN only)
userApp.get("/users/:userId", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched", payload: user });
  } catch (err) {
    next(err);
  }
});

//Toggle user active status (ADMIN only) - activate/deactivate user
userApp.put(
  "/users/:userId/toggle-active",
  verifyToken("ADMIN"),
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      //prevent admin from deactivating themselves
      if (user._id.toString() === req.user.id) {
        return res
          .status(400)
          .json({ message: "Admin cannot deactivate themselves" });
      }
      //toggle active status
      user.isUserActive = !user.isUserActive;
      await user.save();
      res.status(200).json({
        message: `User ${user.isUserActive ? "activated" : "deactivated"}`,
        payload: user.isUserActive,
      });
    } catch (err) {
      next(err);
    }
  }
);

//Delete user (ADMIN only)
userApp.delete(
  "/users/:userId",
  verifyToken("ADMIN"),
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      //prevent admin from deleting themselves
      if (user._id.toString() === req.user.id) {
        return res
          .status(400)
          .json({ message: "Admin cannot delete themselves" });
      }
      await UserModel.findByIdAndDelete(req.params.userId);
      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      next(err);
    }
  }
);