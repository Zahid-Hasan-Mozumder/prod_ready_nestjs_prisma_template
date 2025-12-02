import { Module } from '@nestjs/common';
import { PrismaModule } from './external/prisma/prisma.module';
import { ConfigModule } from './external/config/config.module';
import { UserModule } from './api/user/user.module';
import { PostModule } from './api/post/post.module';

@Module({
  imports: [PrismaModule, ConfigModule, UserModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
