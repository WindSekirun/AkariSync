import { Body, Controller, Get, Put } from "@nestjs/common";
import { AppService } from "./app.service";
import { SyncData } from "./schema/syncdata.schema";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getMessage();
  }

  @Get("syncdata/list")
  async getSyncDataList(): Promise<SyncData[]> {
    return this.appService.getSyncDataList();
  }

  @Put("syncdata/create")
  async createSyncData(@Body() syncData: SyncData): Promise<SyncData> {
    return this.appService.createSyncData(syncData);
  }
}
