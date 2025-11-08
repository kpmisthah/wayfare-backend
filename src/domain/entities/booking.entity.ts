import { BookingStatus } from "../enums/booking-status.enum";

export class BookingEntity {
    constructor(
        private readonly _id:string,
        private readonly _packageId:string,
        private readonly _userId:string,
        private readonly _peopleCount:number,
        private readonly _totalAmount:number,
        private readonly _isCancellationAllowed:boolean,
        private readonly _status:BookingStatus,
        private readonly _travelDate:string,
        private readonly _agencyId:string,
        private readonly _commission:number,
        private readonly _platformEarning:number,
        private readonly _agencyEarning:number,
        private readonly _paymentIndentedId?:string
    ){}
    static create(props:{
        packageId:string,
        userId:string,
        peopleCount:number,
        totalAmount:number,
        isCancellationAllowed:boolean,
        status:BookingStatus,
        agencyId:string,
        travelDate:string,
        commission:number,
    }){
        console.log(props,'props in create');
        let platformEarning = (props.totalAmount * props.commission)/100
        let agencyEarning = props.totalAmount - platformEarning
        return new BookingEntity(
            '',
            props.packageId,
            props.userId,
            props.peopleCount,
            props.totalAmount,
            props.isCancellationAllowed,
            props.status,
            props.travelDate,
            props.agencyId,
            props.commission,
            platformEarning,
            agencyEarning
        )
    }

    public updateBooking(props:{
        status:BookingStatus
    }){
        return new BookingEntity(
            this._id,
            this._packageId,
            this._userId,
            this._peopleCount,
            this._totalAmount,
            this._isCancellationAllowed,
            props.status ?? this._status,
            this._travelDate,
            this._agencyId,
            this._commission,
            this._platformEarning,
            this._agencyEarning,
            this._paymentIndentedId
        )
    }

    ///getters
    get id (){
        return this._id
    }
    get packageId(){
        return this._packageId
    }
    get userId(){
        return this._userId
    }

    get peopleCount(){
        return this._peopleCount
    }
    get totalAmount(){
        return this._totalAmount
    }
    get isCancellation(){
        return this._isCancellationAllowed
    }
    get status(){
        return this._status
    }
    get travelDate(){
        return this._travelDate
    }
    get paymentIndentedId(){
        return this._paymentIndentedId
    }
    get agencyId(){
        return this._agencyId
    }

    get commission(){
        return this._commission
    }

    get platformEarning(){
        return this._platformEarning
    }

    get agencyEarning(){
        return this._agencyEarning
    }
}
