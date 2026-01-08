import mongoose from "mongoose";

const participantsSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    joinedAt:{
        type: Date,
        default: Date.now,
    }},{
    _id:false
});

const groupSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }},{
    _id:false
});

const conversationSchema = new mongoose.Schema({

    type:{
        type:String,
        enum:["direct","group"],
        required:true,
},
    participants:{
        type:[participantsSchema],
        required:true,
    },
    group:
        {
            type:groupSchema,
            required: false,
            default: null
        },
    lastMessageAt:{
        type:Date,
    },
    seenBy:[{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
}],
    lastMessage:{
        _id:{type:String},
        content:{
            type:String,
            default:null
        },
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },createdAt:{
            type:Date,
            default:null
        },
    },
    unreadCounts:{
        type:Map,
        of:Number,
        default:() => new Map()
    }
},{
    timestamps:true
});
conversationSchema.index({ "participants.userId": 1, lastMessageAt: -1 });
const Conversation = mongoose.model("Conversation",conversationSchema);
export default Conversation;