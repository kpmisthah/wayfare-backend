import { Inject, Injectable } from '@nestjs/common';
import { WalletEntity } from 'src/domain/entities/wallet.entity';
import { IWalletRepository } from 'src/domain/repositories/wallet/wallet.repository.interface';
import { IWalletUseCase } from '../interfaces/wallet.usecase.interface';
import { WalletDto } from 'src/application/dtos/wallet.dto';
import { WalletMapper } from '../../mapper/waller.mapper';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { ADMIN_TYPE } from 'src/domain/types';
import { IAdminRepository } from 'src/domain/repositories/admin/admin.repository.interface';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { Transaction } from 'src/domain/enums/transaction.enum';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { IWalletTransactionRepository } from 'src/domain/repositories/wallet/wallet-transaction.repository.interface';
import { WalletTransactionEnum } from 'src/domain/enums/wallet-transaction.enum';
import { WalletTransferDto } from 'src/application/dtos/wallet-tranfer.dto';

@Injectable()
export class WalletUsecase implements IWalletUseCase {
  constructor(
    @Inject('IWalletRepository')
    private readonly _walletRepo: IWalletRepository,
    @Inject('IAgencyRepository')
    private readonly _agencyRepo: IAgencyRepository,
    @Inject(ADMIN_TYPE.IAdminRepository)
    private readonly _adminRepo: IAdminRepository,
    @Inject('IWalletTransactionRepo')
    private readonly _walletTransactionRepo: IWalletTransactionRepository,
    
  ) {}
  async createWallet(balance: number, userId: string): Promise<WalletDto> {
    console.log(userId, 'userId');

    let existingWallet = await this._walletRepo.findByUserId(userId);
    console.log(existingWallet, 'ethaan aa existing weallet');

    if (existingWallet.userId != '') {
      return existingWallet
    }
    let wallet = WalletEntity.create({
      userId,
      balance,
    });
    console.log(wallet, 'wallettt');
    let walletEntity = await this._walletRepo.create(wallet);
    console.log(walletEntity, 'walletEntitytyty');

    if (!walletEntity) {
      throw new Error('There is no walllet entity');
    }
    return WalletMapper.toWalletDto(walletEntity);
  }

  async addBalance(balance: number, userId: string,category:WalletTransactionEnum,bookingId:string,paymentStatus:PaymentStatus = PaymentStatus.SUCCEEDED): Promise<WalletDto | null> {
    console.log(balance,'balance',userId,'userId',category,'Categoryyy00 in addBalance');
    
    let existingWallet = await this._walletRepo.findByUserId(userId);
    console.log(existingWallet,'existingWallet in addBalance');
    if (!existingWallet) {
      throw new Error('Wallet not exist');
    }
    let newBalance = existingWallet.balance + balance;
    let update = existingWallet.updateWallet({ balance: newBalance });
    let updateWallet = await this._walletRepo.update(existingWallet.id, update);
    if(category != WalletTransactionEnum.REFUND){
    let agency = await this._agencyRepo.findByUserId(userId)
    // if(!agency) throw new Error("Agency not found")
    const walletTransactionEntity = WalletTransactionEntity.create({
      walletId: updateWallet.id,
      amount: balance,
      transactionType: Transaction.Credit,
      paymentStatus,
      category,
      createdAt:new Date(),
      bookingId,
      agencyId:agency?.id ?? undefined,
    });
    
   await this._walletTransactionRepo.create(walletTransactionEntity);
    
  }
    return WalletMapper.toWalletDto(updateWallet);
  }

  async getWallet(userId: string): Promise<WalletDto | null> {
    let wallet = await this._walletRepo.findByUserId(userId);
    if (!wallet) {
      return null;
    }
    return WalletMapper.toWalletDto(wallet);
  }
  async creditAgency(
    agencyId: string,
    earning: number,
     status: PaymentStatus.PENDING | PaymentStatus.SUCCEEDED,
     bookingId:string
  ): Promise<WalletDto | null> {
    //ee agency id booking l ulle aan athayath book cheytha agency nte id
    let agencyUser = await this._agencyRepo.findById(agencyId);
    if (!agencyUser) return null;
    let wallet = await this._walletRepo.findByUserId(agencyUser.userId);

    if (wallet.userId == '') {
      console.log(agencyUser.userId, 'agencyUser.UserID');

      let createdWallet = await this.createWallet(0, agencyUser.userId);
      if (!createdWallet) throw new Error('Failed to create wallet for agency');
    }
    let updateWallet = await this.addBalance(earning, agencyUser.userId,WalletTransactionEnum.AGENCY_CREDIT,bookingId,status);
    console.log(updateWallet, 'wallet froo agency');

    return updateWallet;
  }
  async creditAdmin(earning: number,bookingId:string): Promise<WalletDto | null> {
    let admin = await this._adminRepo.findAdmin();
    if (!admin) return null;
    let wallet = await this._walletRepo.findByUserId(admin.id);
    if (wallet.userId == '') {
      await this.createWallet(0, admin.id);
    }
    let updateWallet = await this.addBalance(earning, admin.id,WalletTransactionEnum.ADMIN_CREDIT,bookingId);
    return updateWallet;
  }
  async getTransactions(userId: string): Promise<WalletTransferDto[]> {
    let wallet = await this._walletRepo.findByUserId(userId);
    if(!wallet) throw new Error("Wallet not found")
    let transactions = await this._walletTransactionRepo.getTransactionsByWalletId(wallet.id);
    return WalletMapper.toWalletTransactionsDto(transactions);
  } 

  async findByUserId(userId: string): Promise<WalletDto | null> {
    let wallet = await this._walletRepo.findByUserId(userId);
    return WalletMapper.toWalletDto(wallet);
  } 
}
