import { Module } from '@nestjs/common';
import { WhService } from './wh.service';
import { WhController } from './wh.controller';

@Module({
  providers: [WhService],
  controllers: [WhController],
  exports: [],
})
export class WhModule {}
