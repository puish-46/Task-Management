import exp from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

const { hash, compare } = bcrypt;
const { sign } = jwt;

export const commonApp = exp();

//Route for register (only USER role allowed, ADMIN is seeded in DB)
commonApp.post("/users", async (req, res, next) => {
  try {
    const allowedRoles = ["USER"];
    //get user from req
    const newUser = req.body;
    console.log(newUser);

    //check role
    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    //hash password and replace plain with hashed one
    newUser.password = await hash(newUser.password, 12);

    //create New user document
    const newUserDoc = new UserModel(newUser);

    //save document
    await newUserDoc.save();
    //send res
    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.log("err is ", err);
    next(err);
  }
});

commonApp.get("/test", (req, res) => {
  res.send("Common API working");
});

//route for login
commonApp.post("/login", async (req, res, next) => {
  try {
    //get user credentials obj from client
    console.log(req.body);
    const { email, password } = req.body;
    //find user by email
    const user = await UserModel.findOne({ email: email });
    //if email not exits
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    // block login if admin has deactivated the account
    if (!user.isUserActive) {
      return res
        .status(403)
        .json({ message: "Your account has been deactivated by admin" });
    }
    //compare passwords
    const isMatch = await compare(password, user.password);
    //if password not match
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    //if password matched then create token
    const signedToken = sign(
      {
        id: user._id,
        email: email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    //before sending res of token, store token in httponly cookie
    res.cookie("token", signedToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    //remove password
    const UserObj = user.toObject();
    delete UserObj.password;
    //send res
    res.status(200).json({ message: "Login Success", payload: UserObj });
  } catch (err) {
    console.log("err is ", err);
    next(err);
  }
});

commonApp.get("/login-test", (req, res) => {
  res.send("Login route section loaded");
});

//route for logout
commonApp.get("/logout", (req, res) => {
  //delete token from cookie storage
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  //send res
  res.status(200).json({ message: "Logout Success" });
});