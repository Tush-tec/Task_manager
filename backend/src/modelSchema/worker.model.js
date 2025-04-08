import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"


const workerSchema = new Schema (
    {
        googleId : {
            type : String,
            unique: true,
            sparse: true
        },
        username : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true,
        },
        picture : {
            type : String,
        
        }, 
        password: {
            type: String,
            

        },
        role :{
            type : String,
            enum : ["admin", "worker", "subAdmin"], 
            default : "worker"
        }

    },
    {
        timestamps : true
    }
)

// add Confirm password

workerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      { _id: this._id, role: this.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
  };
  
  workerSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
  };


  export const  Worker =  mongoose.model("Worker", workerSchema);
