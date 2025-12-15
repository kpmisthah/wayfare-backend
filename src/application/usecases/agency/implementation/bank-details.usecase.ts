import { Inject, Injectable } from '@nestjs/common';
import { BankDetailsDto } from '../../../dtos/request-payout.dto';
import { BankingEntity } from '../../../../domain/entities/banking.entity';
import { IBankingDetailsRepository } from '../../../../domain/interfaces/agency-bookibnng-details.interface';
import { BankingMapper } from '../../mapper/banking-detail.mapper';
import { IBankingDetailsUsecase } from '../interfaces/agnecy-banking-details.usecase.interface';
import { IAgencyRepository } from '../../../../domain/repositories/agency/agency.repository.interface';

@Injectable()
export class BankingDetailsUsecase implements IBankingDetailsUsecase {
  constructor(
    @Inject('IBankingDetailsRepository')
    private readonly _bankingDetailsRepo: IBankingDetailsRepository,
    @Inject('IAgencyRepository')
    private readonly _agencyRepo: IAgencyRepository,
  ) {}
  async bankDetails(
    bankDetailsDto: BankDetailsDto,
    userId: string,
  ): Promise<BankDetailsDto | null> {
    const agency = await this._agencyRepo.findByUserId(userId);
    if (!agency) {
      throw new Error('Agency not found for this user');
    }

    const bankDetails = BankingEntity.create({
      agencyId: agency.id,
      accountHolderName: bankDetailsDto.accountHolderName,
      accountNumber: bankDetailsDto.accountNumber,
      ifcCode: bankDetailsDto.ifscCode,
      bankName: bankDetailsDto.bankName,
      branch: bankDetailsDto.branch,
    });
    console.log(bankDetails, 'bank detailsss');
    const createBankDetails =
      await this._bankingDetailsRepo.create(bankDetails);
    console.log(createBankDetails, 'createBankDetails');
    if (!createBankDetails) return null;
    return BankingMapper.toBankingDetailsDto(createBankDetails);
  }
  async getBankDetailsByAgency(userId: string): Promise<BankDetailsDto | null> {
    const agency = await this._agencyRepo.findByUserId(userId);
    if (!agency) return null;
    const bankDetails = await this._bankingDetailsRepo.findByAgencyId(
      agency.id,
    );
    console.log(bankDetails, 'bankdetailsss');

    if (!bankDetails) return null;

    return BankingMapper.toBankingDetailsDto(bankDetails);
  }
  async updateBankDetails(
    userId: string,
    updateBankDetailsDto: Partial<BankDetailsDto>,
  ): Promise<BankDetailsDto | null> {
    const agency = await this._agencyRepo.findByUserId(userId);
    if (!agency) return null;
    const existing = await this._bankingDetailsRepo.findByAgencyId(agency.id);

    if (!existing) return null;

    const updatedEntity = existing.update({
      accountHolderName: updateBankDetailsDto.accountHolderName,
      accountNumber: updateBankDetailsDto.accountNumber,
      ifcCode: updateBankDetailsDto.ifscCode,
      bankName: updateBankDetailsDto.bankName,
      branch: updateBankDetailsDto.branch,
    });

    const updated = await this._bankingDetailsRepo.update(
      existing.id,
      updatedEntity,
    );

    if (!updated) return null;

    return BankingMapper.toBankingDetailsDto(updated);
  }
}
