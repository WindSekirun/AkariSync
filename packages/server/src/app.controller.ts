import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
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

  @Post("syncdata/sync/:id")
  async requestSync(@Param() id: string) {
    return this.appService.requestSync(id);
  }
}
