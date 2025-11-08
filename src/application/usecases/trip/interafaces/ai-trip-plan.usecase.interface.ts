import { TripDto } from 'src/application/dtos/Trip.dto';

export interface IAiTripPlanUsecase {
  fetchTripPlan(id: string): Promise<TripDto | null>;
  fetchAllTrip(userId:string):Promise<TripDto[]|null>
}
