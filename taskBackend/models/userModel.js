import { Schema,model } from "mongoose";

const UserSchema=new Schema({
    firstName:{
        type:String,
        required:[true,"First name is required"]
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase: true,
        trim: true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:6
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        required:[true,"{Value} is an Invalid role"],
        default:"USER",
    },
    profileImageUrl:{
        type:String
    },
    isUserActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
});

//create model
export const UserModel = model("user",UserSchema);