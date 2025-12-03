import { Inject, Injectable } from '@nestjs/common';
import { IGenerateAndSaveTrip } from '../interafaces/generate-and-save-trip.usecase.interface';
import { GenerateTripDto } from 'src/application/dtos/generate-trip.dto';
import { IGenerateTripUsecase } from '../interafaces/generate-trip.usecase.interface';
import { ISaveTrip } from '../interafaces/save-trip.usecase.interface';
import { TripDto } from 'src/application/dtos/Trip.dto';
import { TripResponse } from 'src/domain/types/ai.trip.type';

@Injectable()
export class GenerateAndSaveTrip implements IGenerateAndSaveTrip {
  constructor(
    @Inject('IGenerateTripUsecase')
    private readonly _generateTrip: IGenerateTripUsecase,
    @Inject('ISaveTrip')
    private readonly _saveTrip: ISaveTrip,
  ) {}
  async execute(userId: string, dto: GenerateTripDto): Promise<TripDto> {
    const generate = await this._generateTrip.execute(dto);
    const JsonResponse: TripResponse = JSON.parse(generate);
    console.log(dto, 'in ecescurte application generate and save');
    const saveToDb = await this._saveTrip.saveTrip(
      userId,
      JsonResponse,
      dto.startDate,
      dto.visiblity,
    );
    console.log(saveToDb, 'saveToDbb');

    return saveToDb;
  }
}
