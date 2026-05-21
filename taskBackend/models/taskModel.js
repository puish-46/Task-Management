import { Schema,model } from "mongoose";

const TaskSchema=new Schema({
    title:{
        type:String,
        required:[true,"Task title is required"],
        trim:true,
    },
    description:{
        type:String,
        required:[true,"Task description is required"]
    },
    status:{
        type:String,
        enum:["PENDING","IN_PROGRESS","COMPLETED"],
        default:"PENDING",
    },
    priority:{
        type:String,
        enum:["LOW","MEDIUM","HIGH"],
        default:"MEDIUM",
    },
    dueDate:{
        type:Date,
        required:[true,"Due date is required"]
    },
    assignee:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
});

export const TaskModel = model("task",TaskSchema);