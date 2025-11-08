import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GeoCoordinatesDto {
  @IsString() latitude: string;
  @IsString() longitude: string;
}

class HotelDto {
  @IsString() hotelName: string;
  @IsString() hotelAddress: string;
  @IsString() price: string;
  @IsString() hotelImageUrl: string;
  @ValidateNested()
  @Type(() => GeoCoordinatesDto)
  geoCoordinates: GeoCoordinatesDto;
  @IsString() rating: string;
  @IsString() description: string;
}

class PlaceDto {
  @IsString() placeName: string;
  @IsString() placeDetails: string;
  @IsString() placeImageUrl: string;
  @ValidateNested()
  @Type(() => GeoCoordinatesDto)
  geoCoordinates: GeoCoordinatesDto;
  @IsString() ticketPricing: string;
  @IsString() rating: string;
  @IsString() timeToTravel: string;
  @IsString() bestTimeToVisit: string;
}

class DayPlanDto {
  @IsString() day: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceDto)
  plan: PlaceDto[];
}

export class SaveTripDto {
  @IsString()
  destination: string;
  @IsString()
  duration: string;
  @IsString()
  budget: string;
  @IsString()
  travelerType: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HotelDto)
  hotels: HotelDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayPlanDto)
  itinerary: DayPlanDto[];
}
