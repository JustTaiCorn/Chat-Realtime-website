import mongoose from "mongoose";

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
    file: {
      url: { type: String },
      name: { type: String },
      type: { type: String },
      size: { type: Number },
    },
  },
  { timestamps: true }
);
messageSchema.index({ conversationId: 1,createdAt:-1 });
const Message = mongoose.model("Message", messageSchema);
export default Message;
