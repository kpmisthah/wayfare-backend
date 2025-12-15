import { DayPlan, Hotel } from '../../domain/types/ai.trip.type';

export class TripDto {
  id: string;
  userId: string;
  destination: string;
  duration: string;
  budget: string;
  travelerType: string;
  hotels: Hotel[];
  itinerary: DayPlan[];
}
