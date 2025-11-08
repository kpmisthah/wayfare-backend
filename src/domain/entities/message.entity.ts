export class MessageEntity {
    constructor(
        private readonly _id:string,
        private readonly _conversationId:string,
        private readonly _senderId:string,
        private readonly _content:string,
        private readonly _createdAt?:string
    ){}
    static create(props:{
        conversationId:string,
        senderId:string,
        content:string,
        createdAt?:string
    }){
        return new MessageEntity('',props.conversationId,props.senderId,props.content,props.createdAt)
    }

    //getters
    get id(){
        return this._id
    }
    get conversationId(){
        return this._conversationId
    }
    get senderId(){
        return this._senderId
    }
    get content(){
        return this._content
    }
    get createdAt(){
        return this._createdAt
    }
}