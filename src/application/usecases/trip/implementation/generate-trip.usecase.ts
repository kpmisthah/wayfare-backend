import { Inject, Injectable } from '@nestjs/common';
import { GenerateTripDto } from 'src/application/dtos/generate-trip.dto';
import { IAiModel } from 'src/domain/interfaces/aiModal.interface';
import { IGenerateTripUsecase } from '../interafaces/generate-trip.usecase.interface';

@Injectable()
export class GenerateTripUsecase implements IGenerateTripUsecase {
  constructor(
    @Inject('IAiModel')
    private readonly aiService: IAiModel,
  ) {}
  async execute(dto: GenerateTripDto) {
    console.log(dto, 'in dto GenerateTripDto in ai');

    const prompt = `
Generate a detailed travel plan in **valid JSON only**.

Destination: ${dto.destination}
Duration: ${dto.duration} days
Traveler Type: ${dto.travelerType}
Budget: ${dto.budget}

Rules:
- Respond ONLY in JSON (no text, no notes).
- Fill the fields with realistic data.
- Include at least 2 hotels and 3 itinerary items per day.
- All image URLs must be real Unsplash image URLs relevant to the location or name.

{
  "destination": "string",
  "duration": "string",
  "budget": "string",
  "travelerType": "string",
  "hotels": [
    {
      "hotelName": "string",
      "hotelAddress": "string",
      "price": "string",
      "hotelImageUrl": "A valid Unsplash image URL relevant to the hotel or city",
      "geoCoordinates": {
        "latitude": "string",
        "longitude": "string"
      },
      "rating": "string",
      "description": "string"
    }
  ],
  "itinerary": [
    {
      "day": "string",
      "plan": [
        {
          "placeName": "string",
          "placeDetails": "string",
          "placeImageUrl": "A valid Unsplash image URL relevant to the place or city",
          "geoCoordinates": {
            "latitude": "string",
            "longitude": "string"
          },
          "ticketPricing": "string",
          "rating": "string",
          "timeToTravel": "string",
          "bestTimeToVisit": "string"
        }
      ]
    }
  ]
}
`;

    const aiService = await this.aiService.askModal(prompt);
    console.log(aiService, 'aiServiceee');
    return aiService;
  }
}
