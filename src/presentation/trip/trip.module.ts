import { Module } from '@nestjs/common';
import { GenerateTripUsecase } from 'src/application/usecases/trip/implementation/generate-trip.usecase';
import { TripController } from './trip.controller';
import { GenerateAndSaveTrip } from 'src/application/usecases/trip/implementation/generate-and-save-trip.usecase';
import { SaveTrip } from 'src/application/usecases/trip/implementation/save-trip.usecase';
import { AiTripPlanUsecase } from 'src/application/usecases/trip/implementation/ai-trip-plan.usecase';

@Module({
  controllers: [TripController],
  providers: [
    {
      provide: 'IGenerateTripUsecase',
      useClass: GenerateTripUsecase,
    },
    {
      provide: 'IGenerateAndSaveTrip',
      useClass: GenerateAndSaveTrip,
    },
    {
      provide: 'ISaveTrip',
      useClass: SaveTrip,
    },
    {
      provide: 'IAiTripPlanUsecase',
      useClass: AiTripPlanUsecase,
    },
  ],
})
export class TripModule {}
