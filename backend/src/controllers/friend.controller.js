
import Friend from "../models/friends.model.js";
import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";
export const sendFriendRequest=async (req,res)=>{
    try {
        const {to, message} = req.body;
        const from = req.user._id.toString();
        if (from === to) {
            return res.status(400).json({
                message: "Không thể gửi lời mời kết bạn cho chính mình",
            })
        }
        const userExits = await User.findOne({_id:to});
        if(!userExits){
            return res.status(404).json({
                message:"Người dùng không tồn tại",
            })
        }
        let userA = from.toString()
        let userB = to.toString();
        if(userA > userB){
            [userA,userB] = [userB,userA];
        }
        const [alreadyFriends, existingRequest] = await Promise.all([
            Friend.findOne({userA,userB}),
            FriendRequest.findOne({
                $or:[
                    {from,to},
                    {from:to,to:from}]
            })]);
        if(alreadyFriends){
            return res.status(400).json({
                message:"Hai người đã là bạn bè",
            })
        }
        if(existingRequest){
            return res.status(400).json({
                message:"Đã có lời mời kết bạn đang chờ chấp nhận",
            })
        }

        const request = await FriendRequest.create({from,to,message});
        return  res.status(201).json({
            message:"Gửi lời mời kết bạn thành công",
            request,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Lỗi hệ thống",
        })
    }
}

export const acceptFriendRequest=async (req,res)=>{
    try {
const {requestId} = req.params;
const userId = req.user._id;
const request = await FriendRequest.findById(requestId);
if(!request){
    return res.status(404).json({
        message:"Lời mời kết bạn không tồn tại",
    })
}
if(request.to.toString() !== userId.toString()){
    return res.status(403).json({
        message:"Bạn không có quyền chấp nhận lời mời kết bạn này",
    })
}
const friend = await Friend.create({
    userA: request.from,
    userB: request.to,
})
        await FriendRequest.findByIdAndDelete(requestId);
const from = await User.findById(request.from).select("_id fullName  profilePicture").lean();

return res.status(200).json({
    message:"Chấp nhận lời mời kết bạn thành công",
    newFriend:{
        _id:from?._id,
        fullName:from?.fullName,
        profilePicture:from?.profilePicture,
    }
})
    }catch(err){
        console.log("Lỗi khi nhận kết bạn",err);
        return res.status(500).json({
            message:"Lỗi hệ thống",
        })
    }
}

export const declineFriendRequest=async (req,res)=>{
    try {
const {requestId} = req.params;
const userId = req.user._id;
const request = await FriendRequest.findById(requestId);
if(!request){
    return res.status(404).json({
        message:"Lời mời kết bạn không tồn tại",
    })
}
if(request.to.toString() !== userId.toString()){
    return res.status(403).json({
        message:"Bạn không có quyền từ chối lời mời kết bạn này",
    })
}
await FriendRequest.findByIdAndDelete(requestId);
return res.status(200).json({
    message:"Từ chối lời mời kết bạn thành công",
})
    }catch(err){
        console.log("Lỗi khi từ chối kết bạn",err);
        return res.status(500).json({
            message:"Lỗi hệ thống",
        })
    }
}

export const getAllFriends=async (req,res)=>{
    try {
const userId = req.user._id;
const friendship = await Friend.find({
    $or:[
        {userA:userId},
        {userB:userId}
    ]
}).populate("userA userB","_id fullName profilePicture").lean();
     if (!friendship.length){
            return res.status(200).json({
                friends:[],
            })
        }
     const friends = friendship.map((friend)=> {
         friend.userA._id.toString() === userId.toString() ? friend.userB : friend.userA;
     })
        res.status(200).json({
            friends,
        })
    }catch(err){
        console.log("Lỗi khi lấy danh sách bạn bề ",err);
        return res.status(500).json({
            message:"Lỗi hệ thống",
        })
    }
}

export const getFriendRequests=async (req,res)=>{
    try {
        const userId = req.user._id;
        const populateFields = "_id fullName profilePicture";
        const [sent,received] = await Promise.all([
            FriendRequest.find({from:userId}).populate("to",populateFields),
            FriendRequest.find({to:userId}).populate("from",populateFields),
        ]);
        return res.status(200).json({
            sent,
            received,
        })
    }catch(err){
        console.log("Lỗi khi lấy danh sách lời mời kết bạn ",err);
        return res.status(500).json({
            message:"Lỗi hệ thống",
        })
    }
}

export default {sendFriendRequest,acceptFriendRequest,declineFriendRequest,getAllFriends,getFriendRequests};