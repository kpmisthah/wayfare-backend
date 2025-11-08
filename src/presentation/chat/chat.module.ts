import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { MessageController } from "./chat.controller";
import { ChatUsecase } from "src/application/usecases/chat/implementation/message.usecase";

@Module({
  controllers: [MessageController],
  providers: [
    ChatGateway,
    {
        provide:"IChatUsecase",
        useClass:ChatUsecase
    }
  ],
  exports: ["IChatUsecase",ChatGateway],
})
export class ChatModule {}
