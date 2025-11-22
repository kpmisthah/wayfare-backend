import { PaymentStatus } from "../enums/payment-status.enum";
import { Role } from "../enums/role.enum";

export class TransactionEntity {
    constructor(
        private readonly _id:string,
        private readonly _bookingId:string,
        private readonly _agencyId:string,
        private readonly _paymentIntentId:string,
        private readonly _currency:string,
        private readonly _status:PaymentStatus,
        private readonly _amount:number,
        private readonly _initiatedBy:Role
    ){}

    static create(props:{
        bookingId:string,
        agencyId:string,
        paymentIntentId:string,
        currency:string,
        status:PaymentStatus,
        amount:number,
        initiatedBy:Role
    }){
        return new TransactionEntity('',props.bookingId,props.agencyId,props.paymentIntentId,props.currency,props.status,props.amount,props.initiatedBy)
    }
    
    public update(props:{
        bookingId:string,
        status:PaymentStatus,
    }){
        return new TransactionEntity(
            this._id,
            props.bookingId,
            this._agencyId,
            this._paymentIntentId,
            this._currency,
            props.status,
            this._amount,
            this._initiatedBy
        )
    }

    //getters
    get id(){
        return this._id
    }

    get bookingId(){
        return this._bookingId
    }
    get agencyId(){
        return this._agencyId
    }
    get paymentIntentId(){
        return this._paymentIntentId
    }
    get currency(){
        return this._currency
    }
    get status(){
        return this._status
    }
    get amount(){
        return this._amount
    }
    get initiatedBy(){
        return this._initiatedBy
    }
}


