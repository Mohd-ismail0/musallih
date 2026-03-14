import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@musallih/persistence';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
