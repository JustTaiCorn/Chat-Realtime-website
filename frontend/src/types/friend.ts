export interface Friend {
  _id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  bio?: string;
  phone?: string;
}

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
