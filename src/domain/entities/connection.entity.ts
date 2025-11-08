export class ConnectionEntity {
    constructor(
        private readonly _id:string,
        private readonly _senderId:string,
        private readonly _receieverId:string,
        private readonly _status?:string,
        private readonly _createdAt?:Date,
        private readonly _senderName?:string,
        private readonly _recieverName?:string,
        private readonly _profileImage?:string
    ){}

    static create(props:{
        senderId:string,
        receiverId:string,
        status?:string,
        createdAt?:Date,
    }){
        if(!props.senderId){
            throw new Error("SenderId is not defined")
        }
        if(!props.receiverId){
            throw new Error("RecieverId is not defined")
        }

        return new ConnectionEntity(
            "",
            props.senderId,
            props.receiverId,
            props.status,
            props.createdAt
        )
    }

    public update(props:{
        status:string
    }){
        return new ConnectionEntity(
            this._id,
            this._senderId,
            this._receieverId,
            props.status,
            this._createdAt
        )
    }

    get id(){
        return this._id
    }
    get senderId(){
        return this._senderId
    }
    get receiverId(){
        return this._receieverId
    }
    get status(){
        return this._status
    }
    get createdAt(){
        return this._createdAt
    }
    get senderName(){
        return this._senderName
    }
    get recieverName(){
        return this._recieverName
    }
    get profileImage(){
        return this._profileImage
    }
}