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


export {
    createWorker
}

