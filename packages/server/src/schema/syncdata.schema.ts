import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { SyncDataDto } from "@akari-sync/dto";

export type SyncDataDocument = SyncData & Document;

@Schema()
export class SyncData implements SyncDataDto {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  targetId: string;
  @Prop({ required: true })
  platform: string;
  @Prop({ required: true })
  extension: string;
  @Prop({ required: true })
  syncDirectory: string;
  @Prop({ required: true })
  thumbnail: string;
}

export const SyncDataSchema = SchemaFactory.createForClass(SyncData);
