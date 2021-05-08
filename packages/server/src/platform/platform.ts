import { SyncData } from "src/schema/syncdata.schema";

export interface Platform {
  getList(targetId: string);
}
