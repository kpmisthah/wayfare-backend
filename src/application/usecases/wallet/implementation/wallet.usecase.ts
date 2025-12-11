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
import { StatusCode } from 'src/domain/enums/status-code.enum';

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
  ) { }
  async createWallet(balance: number, userId: string): Promise<WalletDto> {
    console.log(userId, 'userId');

    const existingWallet = await this._walletRepo.findByUserId(userId);
    console.log(existingWallet, 'ethaan aa existing weallet');

    if (existingWallet.userId != '') {
      return existingWallet;
    }
    const wallet = WalletEntity.create({
      userId,
      balance,
    });
    console.log(wallet, 'wallettt');
    const walletEntity = await this._walletRepo.create(wallet);
    console.log(walletEntity, 'walletEntitytyty');

    if (!walletEntity) {
      throw new Error('There is no walllet entity');
    }
    return WalletMapper.toWalletDto(walletEntity);
  }

  async addBalance(
    balance: number,
    userId: string,
    category: WalletTransactionEnum,
    bookingId: string,
    paymentStatus: PaymentStatus = PaymentStatus.SUCCEEDED,
  ): Promise<WalletDto | null> {
    const existingWallet = await this._walletRepo.findByUserId(userId);
    console.log(existingWallet, 'existingWallet in addBalance');
    if (!existingWallet) {
      throw new Error('Wallet not exist');
    }
    const newBalance = existingWallet.balance + balance;
    const update = existingWallet.updateWallet({ balance: newBalance });
    const updateWallet = await this._walletRepo.update(
      existingWallet.id,
      update,
    );
    if (category != WalletTransactionEnum.REFUND) {
      const agency = await this._agencyRepo.findByUserId(userId);
      // if(!agency) throw new Error("Agency not found")
      const walletTransactionEntity = WalletTransactionEntity.create({
        walletId: updateWallet.id,
        amount: balance,
        transactionType: Transaction.Credit,
        paymentStatus,
        category,
        createdAt: new Date(),
        bookingId,
        agencyId: agency?.id ?? undefined,
      });

      await this._walletTransactionRepo.create(walletTransactionEntity);
    }
    return WalletMapper.toWalletDto(updateWallet);
  }

  async getWallet(userId: string): Promise<WalletDto | null> {
    const wallet = await this._walletRepo.findByUserId(userId);
    console.log(wallet, 'wallet');
    if (!wallet) {
      return null;
    }
    return WalletMapper.toWalletDto(wallet);
  }
  async creditAgency(
    agencyId: string,
    earning: number,
    status: PaymentStatus.PENDING | PaymentStatus.SUCCEEDED,
    bookingId: string,
  ): Promise<WalletDto | null> {
    //ee agency id booking l ulle aan athayath book cheytha agency nte id
    const agencyUser = await this._agencyRepo.findById(agencyId);
    if (!agencyUser) return null;
    const wallet = await this._walletRepo.findByUserId(agencyUser.userId);

    if (wallet.userId == '') {
      console.log(agencyUser.userId, 'agencyUser.UserID');

      const createdWallet = await this.createWallet(0, agencyUser.userId);
      if (!createdWallet) throw new Error('Failed to create wallet for agency');
    }
    const updateWallet = await this.addBalance(
      earning,
      agencyUser.userId,
      WalletTransactionEnum.AGENCY_CREDIT,
      bookingId,
      status,
    );
    console.log(updateWallet, 'wallet froo agency');

    return updateWallet;
  }

  async deductAgency(
    agencyId: string,
    deductAmount: number,
    status: PaymentStatus.PENDING | PaymentStatus.SUCCEEDED,
    bookingId: string,
  ): Promise<{ status: StatusCode } | null> {
    const agencyUser = await this._agencyRepo.findById(agencyId);
    if (!agencyUser) return null;
    const wallet = await this._walletRepo.findByUserId(agencyUser.userId);
    const walletTransaction =
      await this._walletTransactionRepo.findByBookingId(bookingId);
    if (walletTransaction?.paymentStatus == PaymentStatus.PENDING) {
      const updateWalletTransaction = walletTransaction.updateWalletTransaction(
        { status, deductAmount },
      );
      const c = await this._walletTransactionRepo.update(
        updateWalletTransaction.id,
        updateWalletTransaction,
      );
      console.log(c, 'udoatewallettracnsactuinenety deduct');
    }
    const updateWallet = wallet.updateWallet({
      balance: wallet.balance - deductAmount,
    });
    const d = await this._walletRepo.update(wallet.id, updateWallet);
    console.log(d, 'udedecut wallet amount ==========');

    return { status: StatusCode.SUCCESS };
  }
  async creditAdmin(
    earning: number,
    bookingId: string,
  ): Promise<WalletDto | null> {
    const admin = await this._adminRepo.findAdmin();
    if (!admin) return null;
    const wallet = await this._walletRepo.findByUserId(admin.id);
    if (wallet.userId == '') {
      await this.createWallet(0, admin.id);
    }
    const updateWallet = await this.addBalance(
      earning,
      admin.id,
      WalletTransactionEnum.ADMIN_CREDIT,
      bookingId,
    );
    return updateWallet;
  }
  async getTransactions(userId: string, page: number = 1, limit: number = 10) {
    const wallet = await this._walletRepo.findByUserId(userId);
    if (!wallet) throw new Error('Wallet not found');
    const result = await this._walletTransactionRepo.getTransactionsByWalletId(
      wallet.id,
      page,
      limit,
    );
    return {
      data: WalletMapper.toWalletTransactionsDto(result.data),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    };
  }

  async findByUserId(userId: string): Promise<WalletDto | null> {
    const wallet = await this._walletRepo.findByUserId(userId);
    return WalletMapper.toWalletDto(wallet);
  }

  async getWalletSummary(userId: string): Promise<unknown> {
    const agency = await this._agencyRepo.findByUserId(userId);
    console.log(agency, 'agencyyyy');
    if (!agency) return null;
    return await this._walletTransactionRepo.getWalletSummary(agency.id);
  }

  async getRecentTransaction(userId: string): Promise<unknown> {
    const agency = await this._agencyRepo.findByUserId(userId);
    const limit = 5;
    if (!agency) return null;
    const tx =
      await this._walletTransactionRepo.getRecentAgencyWalletTransactions(
        agency.id,
        limit,
      );
    // Cast tx to the expected type since the repository returns unknown
    return WalletMapper.toRecentWalletTxListDto(
      tx as {
        id: string;
        amount: number;
        status: string;
        createdAt: Date;
        booking?: {
          user?: { name?: string };
          package?: { destination?: string };
        };
      }[],
    );
  }
}
