import mongoose from "mongoose";
const friendsrequestSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            maxLength: 300,
        },

}, {
    timestamps: true
});

friendsrequestSchema.index({from:1,to:1},{unique:true});
friendsrequestSchema.index({
    from:1,
})
friendsrequestSchema.index({to:1});

const FriendRequest = mongoose.model("FriendRequest", friendsrequestSchema);
export default FriendRequest;
