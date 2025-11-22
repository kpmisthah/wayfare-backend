export interface IConversationUsecase{
    execute(userA: string, userB: string)
    getConversation(userId:string)
}