import Conversation from "../models/conversation.model.js";
import Friend from "../models/friends.model.js";
const pair= (a,b)=>{
    ( a < b ? [a,b] : [b,a] )
}
export const checkFriend = (req,res,next)=>{
    try {
        const me = req.user._id.toString();
        const recipientId = req.body?.recipientId ?? null;
        if(!recipientId){
            return res.status(400).json({success:false,message:"Khong tìm thấy người nhận"});
        }
        if(recipientId){
            const [userA,userB] = pair(me,recipientId);
            Friend.findOne({userA,userB}).then(friend=>{
                if(!friend){
                    return res.status(403).json({success:false,message:"Chỉ có thể nhắn tin với bạn bè"});
                }
                next();
            }).catch(err=>{
                return res.status(500).json({success:false,message:"Lỗi hệ thống"});
            })
        }
         //Todo: check for group conversation
    }catch (error){
    console.log(error);
    return res.status(500).json({success:false,message:"Lỗi hệ thống"});
    }
}