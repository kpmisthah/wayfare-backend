import { forwardRef, Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { MessageController } from "./chat.controller";
import { ChatUsecase } from "src/application/usecases/chat/implementation/message.usecase";
import { Server } from "socket.io";
import { ConnectionModule } from "../connection/connection.module";

@Module({
  imports:[ forwardRef(() => ConnectionModule)],
  controllers: [MessageController],
  providers: [
    ChatGateway,
    {
        provide:"IChatUsecase",
        useClass:ChatUsecase
    },
  ],
  exports: ["IChatUsecase",ChatGateway],
})
export class ChatModule {}
