export enum Participants {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  RECEIVER = 'RECEIVER',
  INITIATOR = 'INITIATOR',
}

type ParticipantType = { email: string; name: string };

export type ParticipantEmails = {
  [Participants.BUYER]: ParticipantType;
  [Participants.SELLER]: ParticipantType;
  [Participants.INITIATOR]: ParticipantType;
  [Participants.RECEIVER]: ParticipantType;
};

export type ParticipantEmailSender = (
  participants: ParticipantEmails,
  conversationId: string,
) => Promise<void>;
