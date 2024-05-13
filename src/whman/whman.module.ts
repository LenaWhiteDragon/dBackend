
import { Module } from "@nestjs/common";
import { WhmanController } from "./whman.controller";
import { WhmanService } from "./whman.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [ 
    JwtModule.register({
    global: true,
    secret: "121212",
    signOptions: { expiresIn: '60s' },
  }),
  ], 
  providers: [WhmanService],
  controllers: [WhmanController], 
  exports: [WhmanService],
})
export class WhmanModule {} 