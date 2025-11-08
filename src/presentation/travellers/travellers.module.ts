import { Module } from "@nestjs/common";
import { TravellersController } from "./travellers.controller";
import { TravellersUsecase } from "src/application/usecases/travellers/implementation/travellers.usecase";

@Module({
    controllers:[TravellersController],
    providers:[
        {
            provide:'ITravellersUsecase',
            useClass:TravellersUsecase
        }
    ],
    exports:['ITravellersUsecase']
})

export class TravellersModule {}