import { RecentWalletTxDto } from '../../dtos/recent-wallet.dto';
import { WalletTransferDto } from '../../dtos/wallet-tranfer.dto';
import { WalletDto } from '../../dtos/wallet.dto';
import { WalletEntity } from '../../../domain/entities/wallet.entity';


interface WalletTransactionWithBooking {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  booking?: {
    user?: {
      name?: string;
    };
    package?: {
      destination?: string;
    };
  };
}


interface WalletTransactionWithRelations {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: Date;
  category: string;
  bookingId?: string | null;
  agencyId?: string | null;
  booking?: {
    id: string;
    bookingCode: string;
    travelDate: string;
    package?: {
      id: string;
      itineraryName?: string | null;
      destination?: string | null;
    };
  } | null;
  agency?: {
    id: string;
    user?: {
      name: string;
    };
  } | null;
}

export class WalletMapper {
  static toWalletDto(walletEntity: WalletEntity): WalletDto {
    return {
      id: walletEntity.id,
      userId: walletEntity.userId,
      balance: walletEntity.balance,
    };
  }

  static toWalletTransactionDto(
    transaction: WalletTransactionWithRelations,
  ): WalletTransferDto {
    return {
      id: transaction.id,
      amount: transaction.amount,
      transactionType: transaction.type,
      paymentStatus: transaction.status,
      date: transaction.createdAt,
      category: transaction.category,
      bookingId: transaction.bookingId ?? undefined,
      agencyId: transaction.agencyId ?? undefined,
      booking: transaction.booking
        ? {
            id: transaction.booking.id,
            bookingCode: transaction.booking.bookingCode,
            travelDate: transaction.booking.travelDate,
            package: transaction.booking.package
              ? {
                  id: transaction.booking.package.id,
                  itineraryName:
                    transaction.booking.package.itineraryName ?? undefined,
                  destination:
                    transaction.booking.package.destination ?? undefined,
                }
              : undefined,
          }
        : undefined,
      agency: transaction.agency
        ? {
            id: transaction.agency.id,
            user: transaction.agency.user
              ? {
                  name: transaction.agency.user.name,
                }
              : undefined,
          }
        : undefined,
    };
  }

  static toWalletTransactionsDto(transactions: unknown[]): WalletTransferDto[] {
    return (transactions as WalletTransactionWithRelations[]).map(
      (transaction) => this.toWalletTransactionDto(transaction),
    );
  }

  static toRecentWalletTxDto(
    entity: WalletTransactionWithBooking,
  ): RecentWalletTxDto {
    return {
      id: entity.id,
      amount: entity.amount,
      status: entity.status,
      name: entity.booking?.user?.name ?? 'N/A',
      destination: entity.booking?.package?.destination ?? 'N/A',
      createdAt: entity.createdAt,
    };
  }

  static toRecentWalletTxListDto(
    entities: WalletTransactionWithBooking[],
  ): RecentWalletTxDto[] {
    return entities.map((t) => this.toRecentWalletTxDto(t));
  }
}
