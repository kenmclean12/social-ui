export const AlterParticipantType = {
  ADD: "add",
  REMOVE: "remove",
} as const;

export type AlterParticipantType = typeof AlterParticipantType[keyof typeof AlterParticipantType];

export interface AlterParticipantsDto {
  recipientIds: number[];
  alterType: AlterParticipantType;
}
