import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SyncData, SyncDataDocument } from "./schema/syncdata.schema";
import { SyncRecord, SyncRecordDocument } from "./schema/syncrecord.schema";
import { JobOptions, Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";

@Injectable()
export class AppService {
  constructor(
    @InjectModel(SyncData.name)
    protected syncDataModel: Model<SyncDataDocument>,
    @InjectModel(SyncRecord.name)
    protected syncRecordModel: Model<SyncRecordDocument>,
    @InjectQueue("syncQueue") private syncQueue: Queue
  ) {}

  jobOptions: JobOptions = {
    removeOnComplete: true
  };

  getMessage(): { message: string } {
    return { message: "Hello World!" };
  }

  async getSyncDataList(): Promise<SyncData[]> {
    return this.syncDataModel.find();
  }

  async createSyncData(syncData: SyncData): Promise<SyncData> {
    return this.syncDataModel.create(syncData);
  }

  async requestSync(syncDataId: string) {
    const job = this.syncQueue.add(
      {
        id: syncDataId
      },
      this.jobOptions
    );
    return job;
  }
}
