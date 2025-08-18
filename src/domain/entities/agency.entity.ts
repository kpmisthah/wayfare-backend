import { AgencyStatus } from "../enums/agency-status.enum";
import { Role } from "../enums/role.enum";

export class AgencyEntity {
    constructor(
        private readonly _id:string,
        private readonly _description:string|null,
        private readonly _status:AgencyStatus,
        private readonly _specialization:string[],
        private readonly _phone:string,
        private readonly _role:Role,
        private readonly _userId:string,        
        private readonly _pendingPayouts:number,
        private readonly _totalEarnings:number,        
        private readonly _transactionId?:string|null,
    ){}

    static create(props:{
        description:string,
        status:AgencyStatus,
        specialization:string[],
        phone:string,
        role:Role,
        userId:string,        
        pendingPayouts:number,
        totalEarnings:number,
        transactionId:string|null,
    }){
        if(!props.description){
            throw new Error("Description is mandatory")
        }
        if(!props.phone){
            throw new Error("Phone number is mandatory")
        }
        return new AgencyEntity(
            '',
            props.description,
            props.status,
            props.specialization,
            props.phone,
            props.role,
            props.userId,
            props.pendingPayouts,
            props.totalEarnings,
            props.transactionId     
        )
    }

    public updateAgency(props:{
        status?:AgencyStatus
    }){
        if(!props.status){
            throw new Error("status is not defined")
        }
        return new AgencyEntity(
            this._id,
            this._description,
            props.status,
            this._specialization,
            this._phone,
            this._role,
            this._userId,
            this._pendingPayouts,
            this._totalEarnings,
            this._transactionId
        )
    }
    public updateAgencyProfile(props:{
        description?:string,
        phone?:string,
        specialization?:string[]

    }){
        return new AgencyEntity(
           this._id,
           props.description ?? this._description,
           this._status,
           props.specialization ?? this._specialization,
           props.phone ?? this._phone,
           this._role,
           this._userId,
           this._pendingPayouts,
           this._totalEarnings,
           this._transactionId
        )
    }
    //getters
    get id(){
        return this._id
    }
    get description(){
        return this._description
    }
    get status(){
        return this._status
    }
    get specialization(){
        return this._specialization
    }
    get phone(){
        return this._phone
    }
    get pendingPayouts(){
        return this._pendingPayouts
    }
    get totalEarnings(){
        return this._totalEarnings
    }
    get role(){
        return this._role
    }

    get transactionId(){
        return this._transactionId
    }
    get userId(){
        return this._userId
    }
}