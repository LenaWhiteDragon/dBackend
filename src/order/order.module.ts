
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";

@Module({
  imports: [ 
//     JwtModule.register({
//     global: true,
//     secret: "121212",
//     signOptions: { expiresIn: '60s' },
//   }),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [],
})
export class OrderModule {} 