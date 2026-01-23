export interface Participant {
  _id: string;
  fullName: string;
  profilePicture?: string | null;
  joinedAt: string;
}

export interface SeenUser {
  _id: string;
  fullName?: string;
  profilePicture?: string | null;
}

export interface Group {
  name: string;
  createdBy: string;
}

export interface LastMessage {
  _id: string;
  content: string;
  createdAt: string;
  sender: {
    _id: string;
    fullName: string;
    profilePicture?: string | null;
  };
}

export interface Conversation {
  _id: string;
  type: "direct" | "group";
  group: Group;
  participants: Participant[];
  lastMessageAt: string;
  seenBy: SeenUser[];
  lastMessage: LastMessage | null;
  unreadCounts: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationResponse {
  conversations: Conversation[];
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  imageUrl?: string | null;
  updatedAt?: string | null;
  createdAt: string;
  isOwn?: boolean;
    reactions?: Reaction[];
    replyTo?: ReplyToMessage | null;
}
export interface Reaction {
    _id: string;
    userId: {
        _id: string;
        fullName: string;
        profilePicture?: string | null;
    };
    emoji: string;
    createdAt: string;
}
export interface ReplyToMessage {
    _id: string;
    content: string | null;
    imageUrl?: string | null;
    senderId: {
        _id: string;
        fullName: string;
        profilePicture?: string | null;
    };
}