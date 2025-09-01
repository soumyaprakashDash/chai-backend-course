import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videoFile:{
            type: String, // URL of the video file
            required: true,
        },
        thumbnail:{
            type: String, // URL of the thumbnail image
            required: true,
        },
        title:{
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        description:{
            type: String,
            required: true,
            trim: true,
        },
        duration:{
            type: Number, // Duration in seconds
            required: true,
        },

        views:{
            type: Number,
            default: 0,
        },
        ispublished:{
            type: Boolean,
            default: true,
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
    }
},
{
    timestamps:true
}
)

videoSchema.plugin(mongooseAggregatePaginate);

export const video = mongoose.model("Video", videoSchema);