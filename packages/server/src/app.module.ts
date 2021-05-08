import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { configFactory, configSchema } from "./config";
import { SyncData, SyncDataSchema } from "./schema/syncdata.schema";
import { SyncRecord, SyncRecordSchema } from "./schema/syncrecord.schema";
import { BullModule } from "@nestjs/bull";
import { SyncQueueConsumer } from "./sync.queue.consumer";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
      load: [configFactory]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("mongoUrl")
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([
      { name: SyncData.name, schema: SyncDataSchema },
      { name: SyncRecord.name, schema: SyncRecordSchema }
    ]),
    BullModule.forRootAsync({
      imports: [BullModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>("redisUrl"),
          port: 6379
        }
      }),
      inject: [ConfigService]
    }),
    BullModule.registerQueue({
      name: "syncQueue"
    })
  ],
  controllers: [AppController],
  providers: [AppService, SyncQueueConsumer]
})
export class AppModule {}
