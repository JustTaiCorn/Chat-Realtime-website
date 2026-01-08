import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";


export const  createConversation = async (req, res) => {
    try {
        const {type, memberIds, name} = req.body;
        const userId = req.user._id;

        if(!type || (type === "group" && !name) || !Array.isArray(memberIds) || memberIds.length === 0, !memberIds){
            return res.status(404).send("Tên nhóm và thành viên không được để trống");
        }
        let conversation
        if(type === "direct"){
            const participantId = memberIds[0];
         conversation = await Conversation.findOne({
                type:"direct",
                "participants.userId":{$all:[userId,participantId]},
            });
            if(!conversation){
                conversation = await Conversation.create({
                    type:"direct",
                    participants:[
                        {userId :userId, joinedAt:new Date()},
                        {userId:participantId, joinedAt:new Date()}],
                    lastMessageAt:new Date(),
            });
            }
        }
        else if(type === "group"){
         conversation = await Conversation.create({
                type:"group",
                name,
                participants: [{userId},...memberIds.map(id=>({userId:id, joinedAt:new Date()}))],
                    group:{
                    name,
                        createdBy:userId,
            }
            });
        }

        if(!conversation){
            return res.status(400).send("Conversation khong hop le");
        }

        await conversation.populate([
            {path:"participants.userId", select:" fullName profilePicture" },
            {path:"lastMessage.senderId", select:" fullName profilePicture" },
            {path:"seenBy", select:" fullName profilePicture" }
            ]
        )
        res.status(201).json({success:true,conversation});
    }catch(err){
        console.log("Lỗi tạo cuộc trò chuyện:", err);
        res.status(500).send("Lỗi hệ thống");
    }
}

export const getConversation = async (req, res) => {}

export const getMessages = async (req, res) => {}