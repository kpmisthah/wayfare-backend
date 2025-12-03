import { SaveTripDto } from 'src/application/dtos/Save-ai-trip.dto';
import { TripDto } from 'src/application/dtos/Trip.dto';

export interface ISaveTrip {
  saveTrip(
    userId: string,
    response: SaveTripDto,
    startDate: string,
    visibility: boolean,
  ): Promise<TripDto>;
}
