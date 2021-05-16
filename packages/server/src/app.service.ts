import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SyncData, SyncDataDocument } from "./schema/syncdata.schema";
import { JobOptions, Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { ThumbnailFindExecutor } from "./executor/thumbnail.find.executor";

@Injectable()
export class AppService {
  constructor(
    @InjectModel(SyncData.name)
    protected syncDataModel: Model<SyncDataDocument>,
    @InjectQueue("syncQueue") private syncQueue: Queue
  ) {}
  thumbnailFindExecutor = new ThumbnailFindExecutor();

  jobOptions: JobOptions = {
    removeOnComplete: true
  };

  getMessage(): { message: string } {
    return { message: "Hello World!" };
  }

  async getSyncDataList(): Promise<SyncData[]> {
    return this.syncDataModel.find();
  }

  async getSyncData(id: string): Promise<SyncData> {
    return this.syncDataModel.findById(id);
  }

  async createSyncData(syncData: SyncData): Promise<SyncData> {
    syncData.thumbnail = await this.thumbnailFindExecutor.find(
      syncData.targetId,
      syncData.platform
    );
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

  async requestSync(syncData: SyncData) {
    const job = this.syncQueue.add(
      {
        syncData: syncData
      },
      this.jobOptions
    );
    return job;
  }
}
