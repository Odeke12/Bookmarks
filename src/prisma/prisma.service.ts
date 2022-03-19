import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(config: ConfigService){
        super({datasources: {
            db: {
                url: config.get("DATABASE_URL")
            },
        },
    });
    // console.log(config)
  }

  cleanDb(){
      return this.$transaction([
          this.bookmark.deleteMany(),
          this.user.deleteMany(),
      ])
  }
}