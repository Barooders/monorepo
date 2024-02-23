type UserId = string;
type ConversationId = string;
type MessageId = string;
type UnixMilliseconds = number;
type ByteSize = number;

export type TalkJSMessage = {
  id: MessageId;
  conversationId: ConversationId;
  type: 'UserMessage' | 'SystemMessage';
  readBy: UserId[];
  senderId?: UserId | undefined;
  text?: string;
  attachment?: File;
  origin: 'web' | 'rest' | 'email' | 'import';
  location?: Coordinates;
  createdAt: UnixMilliseconds;
};

export type TalkJSConversation = {
  id: ConversationId;
  subject?: string;
  topicId?: string;
  photoUrl?: string;
  welcomeMessages?: string[];
  custom?: { [name: string]: string };
  participants: {
    [id: UserId]: { access: 'ReadWrite' | 'Read'; notify: boolean };
  };
  createdAt: UnixMilliseconds;
};

export type TalkJSUser = {
  id: UserId;
  name: string;
  welcomeMessage?: string;
  photoUrl?: string;
  headerPhotoUrl?: string;
  role?: string;
  email?: string[] | null;
  phone?: string[] | null;
  custom?: { [name: string]: string };
  availabilityText?: string;
  locale?: string;
  createdAt: UnixMilliseconds;
};

type File = {
  url: string;
  size: ByteSize;
};

type Coordinates = [
  number, // latitude
  number, // longitude
];

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
}
