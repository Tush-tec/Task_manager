import { isValidObjectId } from "mongoose";
import { Worker } from "../modelSchema/worker.model.js";
import bcrypt from "bcryptjs";



const genrateToken = async(workerId) =>{

    try {
        const worker = await Worker.findById(workerId)
    
        if(!(workerId)){
            throw new Error(
                "Invalid workerId, Token is generated with valid WorkerID"
            )
        }
    
    
        const accessToken = worker.generateAccessToken();
        const refreshToken = worker.generateRefreshToken();

    
        worker.refreshToken = refreshToken
        worker.save({validateBeforeSave: false})
    
        return {accessToken, refreshToken}
    } catch (error) {

        console.error(error || error.message);
        process.exit(1)
        
        
    }

}


const createWorker = async(req,res) => {

    try {
        const { username, email, password} = req.body
    
    
        if( !username || !email || !password ){
            throw new Error("Please provide all the required fields")
        }
    
    
        const isExistUsername = await Worker.findOne(
            {
                username : username
            }
        )
    
        if(isExistUsername){
            throw new Error(
                "Username already exists"
            )
        }
    
    
        const isExistEmail = await Worker.findOne(
            {
                email : email
            }
        )
    
        if(isExistEmail){
            throw new Error(
                "Email already exists"
            )
        }
    
        const passwordHashing = await bcrypt.hash(password, 10)
    
        const createWorker = await Worker.create(
            {
                username,
                email,
                password : passwordHashing
            }
        )

        if(!createWorker){
            throw new Error("Failed to create worker")
        }


        return res
        .status(201)
        .json(
            {
                message : "worker created successFully",
                worker : createWorker,
            }
        )
    } catch (error) {
        console.log(error || error.message);

        return new Error(
            error  || error.message
        )
        
    }

    
}


const loginWorker = async (req,res) => {

    const {username, email, password} = req.body 


    if(!username){
        throw new Error("Username is required")
    }

    if(!email){
        throw new Error("Email is required")
    }

    if(!password){
        throw new Error("Fill Your password!")
    }


    const worker = await Worker.findOne(
        {
           
            $and : [
                {username: username},
                {email: email},
            ]
           
        }
    )

    if(!worker){
        throw new Error("Worker not found, Please ensure your username and email are correct")
    }

    const isvalidPassword = bcrypt.compare(
        password,
        worker.password,
        
    )

    if(!isvalidPassword){
        throw new Error("Invalid password")
    }

    const {accessToken, refreshToken} = await genrateToken(worker._id)


    const logedWorker = await Worker.findById(worker._id).select(" -password -refreshToken")

    const cookie = {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: true,
    }

    return  res
    .cookie("accessToken", accessToken,  cookie)
    .cookie("refreshToken", refreshToken, cookie)
    .status(201)
    .json(
        {
            "message" :"worker logged in successFully",
            "status" : 201,
            "data" : logedWorker,
           accessToken: accessToken,
            refreshToken: refreshToken

        }
    )

}


const logoutWorker = async (req,res) =>{

   try {
     const { workerId} = req.params
 
     if(!isValidObjectId(workerId)){
         throw new Error(
             "Invalid worker Id for log out"
         )
     }
 
     const worker = await Worker.findByIdAndUpdate(
         workerId,
         {
             $unset : {
                 refreshToken :1
             }
         },
         {
             new : true
         }
     )
 
     return res
     .status(201)
     .clearCookie("accessToken")
     .clearCookie("refreshToken")
     .json(
         {
             "message" : "Worker is logout",
             "status" : 201,
             "data" : worker
         }
     )
   } catch (error) {

    throw new Error(
        "Error while log out worker",
        error || error.message
    )
    
   }
}

export {
    createWorker,
    loginWorker,
    logoutWorker
}

