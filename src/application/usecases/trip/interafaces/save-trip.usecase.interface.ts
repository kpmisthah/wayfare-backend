import { SaveTripDto } from 'src/application/dtos/Save-ai-trip.dto';
import { TripDto } from 'src/application/dtos/Trip.dto';
import { TripResponse } from 'src/domain/types/ai.trip.type';

export interface ISaveTrip {
  saveTrip(userId: string, response: SaveTripDto,startDate:string,visibility:boolean): Promise<TripDto>
}
