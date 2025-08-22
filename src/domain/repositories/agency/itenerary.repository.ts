import { ItineraryEntity } from "src/domain/entities/itinerary.entity";
import { IBaseRepository } from "../base.repository";

export interface IItineraryRepository extends IBaseRepository<ItineraryEntity|null>{
    getIteneraries():Promise<ItineraryEntity[]|null>
}