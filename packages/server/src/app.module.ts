import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { configFactory, configSchema } from "./config";
import { SyncData, SyncDataSchema } from "./schema/syncdata.schema";
import { SyncRecord, SyncRecordSchema } from "./schema/syncrecord.schema";

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
    ])
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
