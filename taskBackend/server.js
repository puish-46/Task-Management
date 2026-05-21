import exp from 'express'
import { config } from 'dotenv'
import {connect} from 'mongoose'
import {userApp} from "./APIs/userAPI.js"
import {taskApp} from "./APIs/taskAPI.js"
import {commonApp} from "./APIs/commonAPI.js"
import cookieParser from 'cookie-parser'
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { UserModel } from './models/userModel.js';

config()
//create exp app
const app=exp()

app.use(cors({origin: [process.env.FRONTEND_URL || "http://localhost:5173"],credentials: true}));
//cookie parer middleware
app.use(cookieParser())
//body parser middleware
app.use(exp.json())

//path level middlewares
app.use("/user-api",userApp)
app.use("/task-api",taskApp)
app.use("/auth",commonApp)


//seed admin directly in MongoDB on server start
const seedAdmin = async () => {
  try {
    const adminExists = await UserModel.findOne({ role: "ADMIN" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123", 12);
      const admin = new UserModel({
        firstName: "Admin",
        lastName: "User",
        email: process.env.ADMIN_EMAIL || "admin@taskmanager.com",
        password: hashedPassword,
        role: "ADMIN",
        isUserActive: true,
      });
      await admin.save();
      console.log("✅ Admin seeded successfully");
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || "Admin@123"}`);
    } else {
      console.log("✅ Admin already exists, skipping seed");
    }
  } catch (err) {
    console.log("Error seeding admin:", err);
  }
};

//connect to db
const connectdb=async()=>{
    try{
        await connect(process.env.DB_URL);
        console.log("DB server connected")
        //seed admin after DB connection
        await seedAdmin();
        //assgin port
        const port=process.env.PORT || 5000
        app.listen(port,()=>console.log(`server listening port ${port} ...`))
    }catch(err){
        console.log("err in db connect",err)
    }
};

connectdb()

//to handle invalid path middleware
app.use((req,res,next)=>{
    res.status(404).json({message:`path ${req.url} is invalid`})
})


//error handiling middleware
app.use((err, req, res, next) => {
  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Error cause:", err.cause);
  console.log("Full error:", JSON.stringify(err, null, 2));
  //ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  //CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
     const field = Object.keys(keyValue)[0];
     const value = keyValue[field];
     return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }
  //send server side error
  res.status(500).json({ message: "error occurred", error: "Server side error" });
});