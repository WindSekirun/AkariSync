import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
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

  async removeSyncData(id: string) {
    return this.syncDataModel.findByIdAndRemove(id);
  }

  async updateSyncData(id: string, syncData: SyncData) {
    return this.syncDataModel.findByIdAndUpdate(id, syncData, {
      upsert: true,
      useFindAndModify: true
    });
  }

  async requestSync(id: string) {
    const _id = Types.ObjectId.createFromHexString(id);
    const syncData = await this.syncDataModel.findById(_id);
    if (syncData == null) {
      throw Error("id doesn't exists in records");
    }

    const job = this.syncQueue.add(
      {
        syncData: syncData
      },
      this.jobOptions
    );
    return job;
  }
}
