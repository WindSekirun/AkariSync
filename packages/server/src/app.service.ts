import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SyncData, SyncDataDocument } from "./schema/syncdata.schema";
import { SyncRecord, SyncRecordDocument } from "./schema/syncrecord.schema";

@Injectable()
export class AppService {
  constructor(
    @InjectModel(SyncData.name)
    protected syncDataModel: Model<SyncDataDocument>,
    @InjectModel(SyncRecord.name)
    protected syncRecordModel: Model<SyncRecordDocument>
  ) {}

  getMessage(): { message: string } {
    return { message: "Hello World!" };
  }

  async getSyncDataList(): Promise<SyncData[]> {
    return this.syncDataModel.find();
  }

  async createSyncData(syncData: SyncData): Promise<SyncData> {
    return this.syncDataModel.create(syncData);
  }
}
