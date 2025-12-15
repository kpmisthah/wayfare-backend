import { TripDto } from '../../../dtos/Trip.dto';

export interface PaginationOptions {
  page: number;
  limit: number;
  search: string;
}

export interface PaginatedTripsResponse {
  trips: TripDto[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IAiTripPlanUsecase {
  fetchTripPlan(id: string): Promise<TripDto | null>;
  fetchAllTrip(userId: string, options?: PaginationOptions): Promise<PaginatedTripsResponse>;
}
