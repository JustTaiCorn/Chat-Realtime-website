
export interface UserInfo {
  _id: string;
  fullName: string;
  profilePicture?: string;
}

export interface FriendRequest {
  _id: string;
  from?: UserInfo;
  to?: UserInfo;
  message?: string;
  createdAt?: string;
}
