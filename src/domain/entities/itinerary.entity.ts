export class ItineraryEntity {
    constructor(
        private readonly _id:string,
        private readonly _day:string,
        private readonly _activities:string,
        private readonly _meals:string,
        private readonly _accommodation:string,
        private readonly _packageId:string
    ){}
    static create(props:{
        day:string,
        activities:string,
        meals:string,
        accommodation:string,
        packageId:string
    }){
        if(!props.packageId){
            throw Error("No package id")
        }
        return new ItineraryEntity('',props.day,props.activities,props.meals,props.accommodation,props.packageId)
    }

    get id():string{
        return this._id
    }
    get day():string{
        return this._day
    }
    get activities():string{
        return this._activities
    }
    get meals():string{
        return this._meals
    }
    get accommodation():string{
        return this._accommodation
    }
    get packageId():string{
        return this._packageId
    }
}