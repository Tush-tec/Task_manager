import { isValidObjectId } from "mongoose";
import { Worker } from "../modelSchema/worker.model.js";
import bcrypt from "bcryptjs";
import { Task } from "../modelSchema/task.model.js";


const genrateAccessOrRefreshToken = async(adminId) => {

    try {
        const admin = await Worker.findById(adminId)
    
        if(!admin){
            throw new Error("Admin not found");
        }
    
    
        const accessToken =  await admin.generateAccessToken()
        const refreshToken =  await admin.generateRefreshToken()
    
        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });
    
        return { accessToken, refreshToken };
    
    } catch (error) {
        console.error(error || error.message);
        
        process.exit(1)
    }

}

const createAdmin = async (req,res) => {
   try {
     const {username, email, password, role} = req.body
 
 
     if(!username || !email || ! password || !role) {
         return res.status(401).json(
             {
                 "message": "Please fill all the fields",
                 "status": false
 
             }
         )
     }
 
     const existingAdmin =  await  Worker.findOne(
         {
 
             email: email,
             
         }
     )
 
     if(existingAdmin){
         return res.status(409).json(
             {
                 "message": "Admin already exists",
                 "status": false
 
             }
         )
     }
 
     const hashPassword = await bcrypt.hash(password, 10)
 
     const admin = await Worker.create(
         {
            username,
             email,
             password :hashPassword,
             role
         }
     )
 
     return res
     .status(200)
     .json(
         {
             "message": "Admin created successfully",
             "status": 201,
             "data": admin
 
         }
     )
   } catch (error) {
     return res
     .status(500)
     .json(
        {
            "message": "Internal Server Error",
            error : error.message || error,
            "status": 500
        }
        
     )
   }

}


const loginAdmin = async(req,res) => {

    const {email, password} = req.body

    if(!email ||  !password) {
        return res.status(400).json({
            "message": "Please provide both email and password",
            "status": 400
        })
    }

    const admin = await Worker.findOne(
        {
            email,
        }
    )

    if(!admin){
        return res.status(404).json({
            "message": "Admin not found, please check your email",
            "status": 404
        })

    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if(!isMatch){
        return res.status(401).json({
            "message": "Invalid password",
            "status": 401
        })
    }

    const {accessToken, refreshToken} = await genrateAccessOrRefreshToken(
       admin._id 
    )

    const loggedinAdmin = await Worker.findById(admin._id).select("-password -refreshToken")

    const cookiOptions = {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
        
    }

    return res
    .status(201)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken, cookiOptions)
    .json(
        {
            "message": "Admin logged in successfully",
            "status": 201,
            "data": loggedinAdmin,
            "accessToken": accessToken,
            "refreshToken": refreshToken
            
        }
    )
}

const logout = async (req, res) => {
    try {
      const workerId = req.user?._id;
  
      const worker = await Worker.findByIdAndUpdate(
        workerId,
        {
          $unset: { refreshToken: 1 },
        },
        { new: true }
      );
  
      const options = {
        httpOnly: true,
        secure: true,
      };
  
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
          success:true,
          message: `${worker.username} (${worker.email}) logged out successfully`,
          status: 200,
        });
    } catch (error) {
      console.error("Logout error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Error during logout",
        error: error.message,
      });
    }
  };
  
const toggleWorkerRole = async (req, res) => {
  try {
    const { workerId } = req.params;

    if (!isValidObjectId(workerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        status: 400,
      });
    }

    const user = await Worker.findById(workerId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    user.role = user.role === "worker" ? "subAdmin" : "worker";
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Role of ${user.username} changed to ${user.role}`,
      data: user,
    });

  } catch (error) {
    console.error("Error toggling user role:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while toggling role",
      error: error.message,
    });
  }
};

const getManageableUsers = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  

      const skip = (page - 1) * limit;
  

      const total = await Worker.countDocuments({
        role: { $in: ["worker", "subAdmin"] }
      });
  

      const users = await Worker.find({
        role: { $in: ["worker", "subAdmin"] }
      })
        .select("-password -refreshToken")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); 
  
      return res.status(200).json({
        success: true,
        message: "Manageable users fetched successfully",
        data: users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      });
  
    } catch (error) {
      console.error("Error fetching users with pagination:", error.message);
      return res.status(500).json({
        success: false,
        message: "Error fetching users",
        error: error.message
      });
    }
  };
  

const getAllsubAdmin = async (req, res) =>{

   try {
     const adminList = await Worker.find(
         {
             role:{
                 $in:[
                     "subAdmin"
                 ]
             }
         }
     ).select("-password -refreshToken")
 
     return res.status(
         200
     ).json(
         {  success:true,
             message: "Admin list fetched successfully",
             status: 200,
             data: adminList
             
         }
     )
   } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching admin list",
            error: error.message
        })
    }
}

const deleteSubAdmin = async (req, res) => {
    try {
      const { workerId } = req.params;
  
      if (!isValidObjectId(workerId)) {
        return res.status(400).json({
          message: `Invalid worker ID: ${workerId}`,
        });
      }

      
  
      const worker = await Worker.findById(workerId);
      
  
      if (!worker) {
        return res.status(404).json({ message: "Worker not found" });
      }
  
      if (worker.role !== "subAdmin") {
        return res.status(400).json({ message: `the requested worker, ${worker.username}, is not a sub-admin` });

        }

        await Worker.findByIdAndDelete(workerId);

  
      
  
      return res.status(200).json({ message: `Subadmin deleted successfully ${worker.username}` });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

export{
    createAdmin,
    loginAdmin,
    logout,
    toggleWorkerRole,
    getAllsubAdmin,
    deleteSubAdmin,
    getManageableUsers
}