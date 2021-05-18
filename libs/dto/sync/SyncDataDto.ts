export interface SyncDataDto {
  _id?: string;
  name: string;
  targetId: string;
  platform: string;
  extension: string;
  syncDirectory: string;
  thumbnail?: string;
}
