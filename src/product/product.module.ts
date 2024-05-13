
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";

@Module({
  imports: [ 
//     JwtModule.register({
//     global: true,
//     secret: "121212",
//     signOptions: { expiresIn: '60s' },
//   }),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [],
})
export class ProductModule {} 