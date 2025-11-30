export class BankingEntity {
    constructor(
        private readonly _id:string,
        private readonly _agencyId:string,
        private readonly _accountHolderName:string,
        private readonly _accountNumber:string,
        private readonly _ifcCode:string,
        private readonly _bankName:string,
        private readonly _branch:string
    ){}

    static create(props:{
        agencyId:string,
        accountHolderName:string,
        accountNumber:string,
        ifcCode:string,
        bankName:string,
        branch:string
    }){
        return new BankingEntity('',props.agencyId,props.accountHolderName,props.accountNumber,props.ifcCode,props.bankName,props.branch)
    }

    public update(props:{
        accountHolderName?:string,
        accountNumber?:string,
        ifcCode?:string,
        bankName?:string,
        branch?:string
    }){
        return new BankingEntity(
            this._id,
            this._agencyId,
            props.accountHolderName ?? this._accountHolderName,
            props.accountNumber ?? this._accountNumber,
            props.ifcCode ?? this._ifcCode,
            props.bankName ?? this._bankName,
            props.branch ?? this._branch
        )
    }

    //getters
    get id(){
        return this._id
    }
    get agencyId(){
        return this._agencyId
    }
    get accountHolderName(){
        return this._accountHolderName
    }
    get accountNumber(){
        return this._accountNumber
    }
    get ifcCode(){
        return this._ifcCode
    }
    get bankName(){
        return this._bankName
    }
    get branch(){
        return this._branch
    }
}