import jwt from "jsonwebtoken";
import { Worker } from "../modelSchema/worker.model.js";


export const isAdmin = (req,res, next) =>{
    if(req.user && req.user.role === 'admin') {
        return next()
    }

    res.json(
        {
            "error": "You are not an admin",
            "status": 403
        }
    )
}


export const authenticateMiddle = async (req, res, next) => {
    try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }
  
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
      const user = await Worker.findById(decoded._id).select("-password");
  
      if (!user) return res.status(404).json({ error: "User not found" });
  
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
  