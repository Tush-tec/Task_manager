import mongoose  from "mongoose";


const connectionInstance  =async  () => {
    
    try {
        const connectToMongoose = await mongoose.connect(
            `${process.env.MONGO_URI}/taskManage`
        )

        console.log(`DB is Connect to mongoose ${connectToMongoose.connection.host}`);
        
    } catch (error) {
        console.log(error || error.message);
        
        process.exit(1)
    }
}


export default connectionInstance