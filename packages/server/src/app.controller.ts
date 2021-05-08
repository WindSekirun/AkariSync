import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
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

  @Delete("syncdata/delete/:id")
  async removeSyncData(@Param() params) {
    return this.appService.removeSyncData(params.id);
  }

  @Patch("syncdata/patch/:id")
  async updateSyncData(@Param() params, @Body() syncData: SyncData) {
    return this.appService.updateSyncData(params.id, syncData);
  }

  @Post("syncdata/sync/:id")
  async requestSync(@Param() params) {
    return this.appService.requestSync(params.id);
  }
}
