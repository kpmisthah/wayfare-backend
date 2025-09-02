import { PackageStatus } from "../enums/package-status.enum";
export class PackageEntity {
    
    constructor(
        private readonly _id:string,
        private readonly _agencyId:string,
        private readonly _itineraryName:string,
        private readonly _description:string,
        private readonly _highlights:string,
        private readonly _picture:string[],
        private readonly _duration:string,
        private readonly _destination:string,
        private readonly _status:PackageStatus,
        private readonly _price:string,
        private readonly _transportationId:string        
    ){}

    static create(props:{
        agencyId:string,
        itineraryName:string,
        description:string,
        highlights:string,
        picture:string[],
        duration:string,
        destination:string,
        status:PackageStatus,
        price:string,
        transportationId:string
    }){
        return new PackageEntity('',props.agencyId,props.itineraryName,props.description,props.highlights,props.picture,props.duration,props.destination,props.status,props.price,props.transportationId)
    }

    //getters
    get id():string{
        return this._id
    }
    get agencyId():string{
        return this._agencyId
    }
    get itineraryName():string{
        return this._itineraryName
    }
    get description():string{
        return this._description
    }
    get highlights():string{
        return this._highlights
    }
    get picture(){
        return this._picture
    }
    get duration():string{
        return this._duration
    }
    get destination():string{
        return this._destination
    }
    get status():PackageStatus{
        return this._status
    }
    get price():string{
        return this._price
    }
    get transportationId(){
        return this._transportationId
    }
}