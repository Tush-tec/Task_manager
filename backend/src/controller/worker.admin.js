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

            return res.status(404).json(
                {
                    "error": "Please provide all the required fields",
                }
            )
            
        }
    
    
        const isExistUsername = await Worker.findOne(
            {
                username : username
            }
        )
        
    
        if(isExistUsername){

            return res.status(404).json({
                "error": "Username already exists",
            })
        
        }
    
    
        const isExistEmail = await Worker.findOne(
            {
                email : email
            }
        )
    
        if(isExistEmail){

            return res
            .status(401)
            .json(
                {
                    "error": "Email already exists",
                }
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

       


        return res
        .status(201)
        .json(
            {
                success:true,
                message : "worker created successFully",
                worker : createWorker,
            }
        )
    } catch (error) {
        console.log(error || error.message);

        return res.status(500).json(
            {
                error :error.message,
                success : false

            }
        )
        
    }

    
}


const loginWorker = async (req,res) => {

   try {
     const {username, email, password} = req.body 
 
 
     if(!username){
        return res
        .status(403)
        .json({
         success : false,
         message : "username is required",
        })
     }
 
     if(!email){
         return res
         .status(403)
         .json({
             success : false,
             message : "email is required",
 
         })
     }
 
     if(!password){
         return res
         .status(400)
         .json({
             success : false,
             message : "password is required",
 
         })
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
 
         return res
         .status(404)
         .json({
             success : false,
             message :"Worker not found, Please ensure your username and email are correct"
         })
        
     }
 
     const isvalidPassword = bcrypt.compare(
         password,
         worker.password,
         
     )
 
     if(!isvalidPassword){
         return res
         .status(400)
         .json({
             success : false,
             message : "Invalid password",
         })
     }
 
     const {accessToken, refreshToken} = await genrateToken(worker._id)
 
 
     const logedWorker = await Worker.findById(worker._id).select(" -password -refreshToken")
 
     const cookie = {
         httpOnly: true,
         maxAge: 30 * 24 * 60 * 60 * 1000,
         sameSite: "strict",
         secure: true,
     }
 
     return res
  .cookie("accessToken", accessToken, cookie)
  .cookie("refreshToken", refreshToken, cookie)
  .status(201)
  .json({
    message: "Worker logged in successfully",
    status: 201,
    success: true,
    data: {
      worker: logedWorker,
      accessToken,
      refreshToken,
    },
  });

   } catch (error) {
    return res
    .status(500)
    .json({
        success: false,
        error : error || error.message
    })

   }

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

