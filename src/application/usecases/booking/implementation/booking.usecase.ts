import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { IBookingUseCase } from '../interfaces/bookiing.usecase.interface';
import { CreateBookingDto } from 'src/application/dtos/create-booking.dto';
import { IBookingRepository } from 'src/domain/repositories/booking/booking.repository';
import { BookingEntity } from 'src/domain/entities/booking.entity';
import { BookingStatus } from 'src/domain/enums/booking-status.enum';
import { BookingMapper } from '../../mapper/booking.mapper';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { ITransactionRepository } from 'src/domain/repositories/transaction/transaction.repository';
import { ADMIN_TYPE, AGENCY_PACKAGE_TYPE } from 'src/domain/types';
import { IAgencyPackageRepository } from 'src/domain/repositories/agency/agency-package.repository';
import { FetchBookingDto } from 'src/application/dtos/fetch-booking.dto';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { FetchUserBookingDto } from 'src/application/dtos/fetch-user-booking.dto';
import { RefundPolicyEntity } from 'src/domain/entities/refund.entity';
import { BookingStatusDto } from 'src/application/dtos/booking-status.dto';
import { IWalletUseCase } from '../../wallet/interfaces/wallet.usecase.interface';
import { IWalletRepository } from 'src/domain/repositories/wallet/wallet.repository.interface';
import { BookingDto } from 'src/application/dtos/booking.dto';
import { PaymentRegistry } from '../../payment/implementation/payment.registry';
import { WalletTransactionEnum } from 'src/domain/enums/wallet-transaction.enum';
import { IWalletTransactionRepository } from 'src/domain/repositories/wallet/wallet-transaction.repository.interface';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { Transaction } from 'src/domain/enums/transaction.enum';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { BookingResponseDto } from 'src/application/dtos/booking-details-response.dto';
import { IAdminRepository } from 'src/domain/repositories/admin/admin.repository.interface';
import { RecentBookingResponse } from 'src/application/dtos/recent-booking-response.dto';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';

@Injectable()
export class BookingUseCase implements IBookingUseCase {
  private readonly _logger = new Logger(BookingUseCase.name);

  constructor(
    @Inject('IBookingRepository')
    private readonly _bookingRepo: IBookingRepository,
    @Inject('IAgencyRepository')
    private readonly _agencyRepo: IAgencyRepository,
    @Inject('ITransactionRepository')
    private readonly _transactionRepo: ITransactionRepository,
    @Inject(AGENCY_PACKAGE_TYPE.IAgencyPackageRepository)
    private readonly _packageRepo: IAgencyPackageRepository,
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
    @Inject('IWalletUseCase')
    private readonly _walletUsecase: IWalletUseCase,
    @Inject('IWalletRepository')
    private readonly _walletRepo: IWalletRepository,
    private readonly _paymentRegistry: PaymentRegistry,
    @Inject('IWalletTransactionRepo')
    private readonly _walletTransactionRepo: IWalletTransactionRepository,
    @Inject(ADMIN_TYPE.IAdminRepository)
    private readonly _adminRepo: IAdminRepository,
  ) {}
  @UseGuards(AccessTokenGuard)
  async createBooking(
    createBookingDto: BookingDto,
    userId: string,
  ): Promise<{ booking: CreateBookingDto; checkoutUrl: string } | null> {
    this._logger.log('Creating booking', {
      userId,
      packageId: createBookingDto.packageId,
    });

    const bookingPackage = await this._packageRepo.findById(
      createBookingDto.packageId,
    );
    if (!bookingPackage) {
      this._logger.error('Package not found', {
        packageId: createBookingDto.packageId,
      });
      throw new Error('Package not found');
    }

    const agency = await this._agencyRepo.findById(bookingPackage.agencyId);
    if (!agency) {
      this._logger.error('Agency not found', {
        agencyId: bookingPackage.agencyId,
      });
      return null;
    }

    const bookingEntity = BookingEntity.create({
      packageId: createBookingDto.packageId,
      userId,
      peopleCount: createBookingDto.peopleCount,
      totalAmount: createBookingDto.totalAmount,
      isCancellationAllowed: true,
      status: BookingStatus.PENDING,
      agencyId: agency.id,
      travelDate: createBookingDto.travelDate,
      commission: 10,
    });

    const booking = await this._bookingRepo.create(bookingEntity);
    if (!booking) {
      this._logger.error('Failed to create booking', {
        userId,
        packageId: createBookingDto.packageId,
      });
      return null;
    }

    this._logger.log('Booking created', {
      bookingId: booking.id,
      userId,
      amount: booking.totalAmount,
      paymentType: createBookingDto.paymentType,
    });

    const handler = this._paymentRegistry.get(createBookingDto.paymentType!);
    const paymentResult = await handler.payment(booking, booking.agencyId);
    return {
      booking: BookingMapper.toBookDto(booking),
      checkoutUrl: paymentResult.checkoutUrl || '',
    };
  }

  async fetchBookings(userId: string): Promise<FetchBookingDto[] | null> {
    const agency = await this._agencyRepo.findByUserId(userId);
    if (!agency) return null;
    const bookings = await this._bookingRepo.fetchBookingDetails(agency.id);
    console.log(bookings, 'bookings in booking.usecase');
    const userEntity = await Promise.all(
      bookings.map((booking) => this._userRepo.findById(booking.userId)),
    );
    console.log(userEntity, 'in booking.usecase');
    const filteredBooking = bookings.filter(
      (booking) => booking.agencyId != null,
    );
    console.log(filteredBooking);

    const packageEntity = await Promise.all(
      filteredBooking.map((booking) =>
        this._packageRepo.findBookedPackage(booking.agencyId),
      ),
    );
    console.log(packageEntity, 'in booking.usecase');

    return BookingMapper.toFetchBookingsDto(
      bookings,
      userEntity,
      packageEntity,
    );
  }

  async getUserBookings(
    userId: string,
    page: number,
    limit: number,
    search?: string,
    status?: string,
  ): Promise<{
    data: (FetchUserBookingDto | undefined)[];
    totalPages: number;
    page: number;
    total: number;
  }> {
    console.log(
      page,
      'pageee',
      limit,
      'limitttt',
      search,
      'searchhh',
      status,
      'statuss',
    );

    const result = await this._bookingRepo.findByUserId(userId, {
      search,
      status,
      page,
      limit,
    });

    if (!result.data || result.data.length === 0) {
      return { data: [], totalPages: 0, page, total: 0 };
    }

    const totalPages = Math.ceil(result.total / limit);
    const paginatedBookings = result.data;

    const packageEntity = await this._packageRepo.getAllPackages();
    const packages = paginatedBookings.map((booking) =>
      packageEntity.find((pkg) => pkg.id == booking.packageId),
    );
    const agencies = await Promise.all(
      paginatedBookings.map((booking) => {
        if (booking) {
          return this._agencyRepo.findById(booking.agencyId);
        }
        return Promise.resolve(null);
      }),
    );
    console.log(agencies, 'agenciesin userbookingss');
    const filteredAgencies = agencies.filter(
      (agency) => agency !== null && agency !== undefined,
    );

    console.log(filteredAgencies, 'filtered agenciesin userbookingss');
    const agencyUsers = await Promise.all(
      agencies.map((agency) => {
        if (agency) {
          return this._userRepo.findById(agency.userId);
        }
        return Promise.resolve(null);
      }),
    );
    console.log(agencyUsers, 'agency usersin userbookingss');
    const filteredAgencyUsers = agencyUsers.filter(
      (user) => user !== null && user !== undefined,
    );
    console.log(filteredAgencyUsers, 'filtered agency usersin userbookingss');
    const mapped = BookingMapper.toFetchUserBookingsDto(
      paginatedBookings,
      packages,
      filteredAgencyUsers,
      filteredAgencies,
    );
    console.log(mapped, 'mapped in usecase');
    return {
      data: mapped,
      totalPages,
      page,
      total: result.total,
    };
  }

  async cancelBooking(id: string): Promise<BookingStatusDto | null> {
    this._logger.log('Processing booking cancellation', { bookingId: id });

    const bookingEntity = await this._bookingRepo.findById(id);
    if (!bookingEntity) {
      this._logger.warn('Booking not found for cancellation', {
        bookingId: id,
      });
      return null;
    }

    const travelStartDate = new Date(bookingEntity.travelDate);
    const refundPercentage =
      RefundPolicyEntity.calculateRefund(travelStartDate);

    const updateBookingStatus = bookingEntity.updateBooking({
      status: BookingStatus.CANCELLED,
    });

    const update = await this._bookingRepo.update(id, updateBookingStatus);
    if (!update) {
      this._logger.error('Failed to update booking status', { bookingId: id });
      return null;
    }

    this._logger.log('Booking cancelled', {
      bookingId: id,
      userId: bookingEntity.userId,
      refundPercentage,
    });

    if (refundPercentage > 0) {
      const refundAmount = (bookingEntity.totalAmount * refundPercentage) / 100;

      this._logger.log('Processing refund', {
        bookingId: id,
        refundAmount,
        refundPercentage,
      });

      let existingWallet = await this._walletUsecase.findByUserId(
        bookingEntity.userId,
      );

      if (existingWallet?.userId != '') {
        await this._walletUsecase.addBalance(
          refundAmount,
          bookingEntity.userId,
          WalletTransactionEnum.REFUND,
          bookingEntity.id,
          PaymentStatus.SUCCEEDED,
        );
      } else {
        const newWallet = await this._walletUsecase.createWallet(
          refundAmount,
          bookingEntity.userId,
        );
        existingWallet = newWallet;
      }

      await this._walletUsecase.deductAgency(
        bookingEntity.agencyId,
        refundAmount,
        PaymentStatus.SUCCEEDED,
        bookingEntity.id,
      );

      const walletTransactionEntity = WalletTransactionEntity.create({
        walletId: existingWallet?.id ?? '',
        amount: refundAmount,
        transactionType: Transaction.Credit,
        paymentStatus: PaymentStatus.REFUNDED,
        category: WalletTransactionEnum.REFUND,
        createdAt: new Date(),
        bookingId: bookingEntity.id,
        agencyId: bookingEntity.agencyId,
      });
      await this._walletTransactionRepo.create(walletTransactionEntity);

      this._logger.log('Refund processed', {
        bookingId: id,
        userId: bookingEntity.userId,
        refundAmount,
      });
    }

    return BookingMapper.toUpdateBookingStatus(update);
  }

  async updateBookingStatus(
    bookingId: string,
    agencyId: string,
    status: BookingStatus,
  ): Promise<BookingEntity> {
    console.log(agencyId, 'agencyId');
    console.log(bookingId, 'bookingId');

    return await this._bookingRepo.updateStatus(bookingId, status);
  }

  async execute(
    packageId: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    const result = await this._bookingRepo.findByPackageId(
      packageId,
      page,
      limit,
      search,
    );
    return {
      data: BookingMapper.toResponseBookingDtoByPackageId(result.data),
      total: result.total,
      page,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  async paymentVerification(bookingId: string) {
    const transaction = await this._transactionRepo.findByBookingId(bookingId);
    console.log('Reached Payment Controller at:', new Date().toISOString());
    console.log(transaction, '-----trnasaction----');
    if (!transaction) return null;
    return {
      status: transaction.status,
    };
  }

  async getUserBookingDetails(id: string): Promise<BookingResponseDto | null> {
    const getBookingDetails =
      await this._bookingRepo.fetchUserBookingDetails(id);
    console.log(getBookingDetails, 'getBookingdetailss');
    if (!getBookingDetails) {
      return null;
    }
    return BookingMapper.toBookingResponseDto(getBookingDetails);
  }

  async retryPayment(
    bookingId: string,
    userId: string,
  ): Promise<{ url: string }> {
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking || booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status != BookingStatus.PENDING) {
      throw new BadRequestException('cannot retry payment');
    }
    const handler = this._paymentRegistry.get('card');
    const result = await handler.payment(booking, booking.agencyId);
    if (!result.checkoutUrl) {
      throw new BadRequestException('checkoutUrl is not found');
    }
    return { url: result.checkoutUrl };
  }

  async getRecentBookings(): Promise<RecentBookingResponse[]> {
    const limit = 5;
    const data = await this._adminRepo.findRecentBookings(limit);

    return data.map((item) => ({
      id: item.id,
      customerName: item.user?.name ?? 'Unknown',
      agencyName: item.agency?.user?.name ?? 'Unknown',
      destination: item.package?.destination ?? 'Unknown',
      amount: item.totalAmount,
      status: item.status,
      createdAt: item.createdAt,
    }));
  }
}
