import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { SyncRecordDto } from "@akari-sync/dto";

export type SyncRecordDocument = SyncRecord & Document;

@Schema()
export class SyncRecord implements SyncRecordDto {
  @Prop({ required: true })
  dataId: string;
  @Prop({ required: true })
  timestamp: number;
  @Prop({ required: true })
  syncStatus: string;
}

export const SyncRecordSchema = SchemaFactory.createForClass(SyncRecord);
