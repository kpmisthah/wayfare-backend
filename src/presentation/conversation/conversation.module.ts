import { Module } from "@nestjs/common";
import { ConversationController } from "./conversation.controller";
import { ConversationUseCase } from "src/application/usecases/conversation/implementation/create-conversation.usecase";

@Module({
  controllers: [ConversationController],
  providers: [
    {
        provide:"IConversationUseCase",
        useClass:ConversationUseCase
    }
  ],
  exports: ["IConversationUseCase"],
})
export class ConversationModule {}
