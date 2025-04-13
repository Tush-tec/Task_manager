import mongoose, {Schema} from "mongoose";

const taskSchema = new Schema (
    {
        tittle: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        assignedTo: [{
            type : Schema.Types.ObjectId,
            ref:"Worker",
            required:true
        }],
        status : {
            type: String,
            enum: ['pending',"issue", 'in_progress', 'done'],
            default: 'pending'

        },
        dueDate: {
            type: Date,
        }

    },
    {
        timestamps: true
    }
)

export const Task = mongoose.model("Task", taskSchema);