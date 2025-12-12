import { Inject, Injectable } from '@nestjs/common';
import { GenerateTripDto } from 'src/application/dtos/generate-trip.dto';
import { IAiModel } from 'src/domain/interfaces/aiModal.interface';
import { IGenerateTripUsecase } from '../interafaces/generate-trip.usecase.interface';

@Injectable()
export class GenerateTripUsecase implements IGenerateTripUsecase {
  constructor(
    @Inject('IAiModel')
    private readonly aiService: IAiModel,
  ) { }
  async execute(dto: GenerateTripDto) {
    console.log(dto, 'in dto GenerateTripDto in ai');

    let preferencesSection = '';
    if (dto.preferences) {
      preferencesSection = `\nUser Preferences:`;

      if (dto.preferences.activities && dto.preferences.activities.length > 0) {
        preferencesSection += `\n- Preferred Activities: ${dto.preferences.activities.join(', ')}`;
        preferencesSection += `\n  IMPORTANT: Prioritize these activities in the itinerary. At least 70% of planned activities should match user preferences.`;
      }

      if (dto.preferences.pace) {
        const paceGuide = {
          relaxed: '2-3 activities per day with plenty of free time',
          moderate: '4-5 activities per day with balanced schedule',
          packed: '6+ activities per day for maximum exploration'
        };
        preferencesSection += `\n- Travel Pace: ${dto.preferences.pace} (${paceGuide[dto.preferences.pace as keyof typeof paceGuide]})`;
      }

      if (dto.preferences.interests && dto.preferences.interests.length > 0) {
        preferencesSection += `\n- Special Interests: ${dto.preferences.interests.join(', ')}`;
        preferencesSection += `\n  Focus on destinations and activities related to these interests.`;
      }
    }

    const prompt = `
Generate a detailed travel plan in **valid JSON only**.

Destination: ${dto.destination}
Duration: ${dto.duration} days
Traveler Type: ${dto.travelerType}
Budget: ${dto.budget}${preferencesSection}

Rules:
- Respond ONLY in JSON (no text, no notes).
- Fill the fields with realistic data.
- Include at least 2 hotels and ${dto.preferences?.pace === 'relaxed' ? '2-3' : dto.preferences?.pace === 'packed' ? '6+' : '4-5'} itinerary items per day based on travel pace.
- All image URLs must be real Unsplash image URLs relevant to the location or name.
${dto.preferences?.activities ? `- PRIORITIZE activities matching: ${dto.preferences.activities.join(', ')}` : ''}
${dto.preferences?.interests ? `- Include places and experiences related to: ${dto.preferences.interests.join(', ')}` : ''}
- Activities should be realistic and available at the destination.
- Consider the budget level when selecting hotels and activities.

{
  "destination": "string",
  "duration": "string",
  "budget": "string",
  "travelerType": "string",
  "hotels": [
    {
      "hotelName": "string",
      "hotelAddress": "string",
      "price": "string (appropriate for ${dto.budget} budget)",
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
          "placeName": "string (prioritize user preferences if provided)",
          "placeDetails": "string",
          "placeImageUrl": "A valid Unsplash image URL relevant to the place or city",
          "geoCoordinates": {
            "latitude": "string",
            "longitude": "string"
          },
          "ticketPricing": "string (appropriate for ${dto.budget} budget)",
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
