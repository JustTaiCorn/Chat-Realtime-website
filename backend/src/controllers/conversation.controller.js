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

export const getConversation = async (req, res) => {
    try{
        const userId = req.user._id;
        const conversations = await Conversation.find({
            "participants.userId":userId,
        }).sort({lastMessageAt:-1,updatedAt:-1})
            .populate([
            {path:"participants.userId", select:" fullName profilePicture"},
            {path:"lastMessage.senderId", select:" fullName profilePicture" },
            {path:"seenBy", select:" fullName profilePicture" }
        ])
        const format = conversations.map((conversation)=>{
            const participants = conversation.participants.map((p)=> {
                return {
                    _id: p.userId._id,
                    fullName: p.userId.fullName,
                    profilePicture: p.userId.profilePicture,
                }
            })
            return {
                ...conversation.toObject(),
                unreadCounts:conversation.unreadCounts || 0,
                participants,
            }
        })
        return res.status(200).json({success:true,conversations:format});
    }catch (e) {
        console.log("Lỗi xảy ra khi lấy conversation",e)
        res.status(500).send("Lỗi hệ thống");
    }

}

export const getMessages = async (req, res) => {
    try {
        const {conversationId} = req.params;
        const {limit = 50, cursor} = req.query;
        const query = {conversationId};
        if(cursor){
            query.createdAt = {$lt: new Date(cursor)};
        }
        let messages = await Message.find(query).sort({createdAt:-1}).limit(Number(limit)+1)
        let nextCursor = null;
        if(messages.length > Number(limit)){
            const nextMessage = messages[messages.length -1];
            nextCursor = nextMessage.createdAt.toISOString();
            messages.pop()
        }
        messages.reverse();
        return res.status(200).json({success:true,messages,nextCursor});
    }catch (e) {
        console.error(e);
        res.status(500).send("Lỗi hệ thống");
    }


}