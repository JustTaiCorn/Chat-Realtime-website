import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    emoji: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const messageSchema = new mongoose.Schema(
  {
      conversationId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Conversation",
          required: true,
          index: true
      },
    content: { type: String, trim:true },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: { type: String },
    reactions: [reactionSchema],
    file: {
      url: { type: String },
      name: { type: String },
      type: { type: String },
      size: { type: Number },
    },
      replyTo:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
          default:null
      }
  },
  { timestamps: true }
);
messageSchema.index({ conversationId: 1,createdAt:-1 });
const Message = mongoose.model("Message", messageSchema);
export default Message;
