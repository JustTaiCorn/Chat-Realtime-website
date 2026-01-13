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

export interface FriendRequest {
  id: string;
  fullname: string;
  profilePicture?: string;
}
