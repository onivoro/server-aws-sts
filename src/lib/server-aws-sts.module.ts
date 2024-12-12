import { Module } from '@nestjs/common';
import { moduleFactory } from '@onivoro/server-common';
import { STSClient } from '@aws-sdk/client-sts';
import { StsService } from './services/sts.service';
import { ServerAwsStsConfig } from './classes/server-aws-sts-config.class';

let stsClient: STSClient | null = null;

@Module({})
export class ServerAwsStsModule {
  static configure(config: ServerAwsStsConfig) {
    return moduleFactory({
      module: ServerAwsStsModule,
      providers: [
        {
          provide: STSClient,
          useFactory: () => stsClient
            ? stsClient
            : stsClient = new STSClient({
              region: config.AWS_REGION,
              logger: console,
              credentials: config.NODE_ENV === 'production'
                ? undefined
                : {
                  accessKeyId: config.AWS_ACCESS_KEY_ID,
                  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
                }
            })
        },
        { provide: ServerAwsStsConfig, useValue: config },
        StsService
      ]
    })
  }
}
