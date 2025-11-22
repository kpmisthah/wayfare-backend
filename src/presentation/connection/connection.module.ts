import { Module } from "@nestjs/common";
import { ConnectionController } from "./connection.controller";
import { SendConnectionUseCase } from "src/application/usecases/connection/implementation/send-connection.usecase";
import { AcceptConnectionUseCase } from "src/application/usecases/connection/implementation/accept-connection.usecase";
import { RejectConnectionUseCase } from "src/application/usecases/connection/implementation/reject-connection.usecase";
import { ConversationModule } from "../conversation/conversation.module";
import { ChatModule } from "../chat/chat.module";


@Module({
  imports:[ConversationModule,ChatModule],
  controllers: [ConnectionController],
  providers: [
    {
        provide:"ISendConnectionUseCase",
        useClass:SendConnectionUseCase,
    },
    {
        provide:"IAcceptConnectionUseCase",
        useClass:AcceptConnectionUseCase,
    },
    {
        provide:"IRejectConnectionUseCase",
        useClass:RejectConnectionUseCase,
    }
  ],
})
export class ConnectionModule {}
