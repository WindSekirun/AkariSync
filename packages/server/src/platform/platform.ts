import { SyncData } from "src/schema/syncdata.schema";

export interface Platform {
 platformType: string;

  getList(syncData: SyncData);
}
