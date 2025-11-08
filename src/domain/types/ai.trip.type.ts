export interface GeoCoordinates {
  latitude: string;
  longitude: string;
}

export interface Hotel {
  hotelName: string;
  hotelAddress: string;
  price: string;
  hotelImageUrl: string;
  geoCoordinates: GeoCoordinates;
  rating: string;
  description: string;
}

export interface Place {
  placeName: string;
  placeDetails: string;
  placeImageUrl: string;
  geoCoordinates: GeoCoordinates;
  ticketPricing: string;
  rating: string;
  timeToTravel: string;
  bestTimeToVisit: string;
}

export interface DayPlan {
  day: string;
  plan: Place[];
}

export interface TripResponse {
  destination: string;
  duration: string;
  budget: string;
  travelerType: string;
  hotels: Hotel[];
  itinerary: DayPlan[];
}
