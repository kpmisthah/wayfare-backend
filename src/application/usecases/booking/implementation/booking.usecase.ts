import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { IBookingUseCase } from '../interfaces/bookiing.usecase.interface';
import { CreateBookingDto } from 'src/application/dtos/create-booking.dto';
import { IBookingRepository } from 'src/domain/repositories/booking/booking.repository';
import { BookingEntity } from 'src/domain/entities/booking.entity';
import { BookingStatus } from 'src/domain/enums/booking-status.enum';
import { BookingMapper } from '../../mapper/booking.mapper';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { ITransactionRepository } from 'src/domain/repositories/transaction/transaction.repository';
import { AGENCY_PACKAGE_TYPE } from 'src/domain/types';
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

@Injectable()
export class BookingUseCase implements IBookingUseCase {
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
  ) {}

  async createBooking(
    createBookingDto: BookingDto,
    userId: string,
  ): Promise<{ booking: CreateBookingDto; clientSecret: string } | null> {
    const bookingPackage = await this._packageRepo.findById(
      createBookingDto.packageId,
    );
    console.log(bookingPackage, 'booking package in booking.usecase');
    if (!bookingPackage) throw new Error('Package not found');
    const agency = await this._agencyRepo.findById(bookingPackage.agencyId);
    console.log(agency, 'in booking.suecase');

    if (!agency) return null;
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
    console.log(booking, 'createdBooking in booking.suecase');

    if (!booking) return null;

    const handler = this._paymentRegistry.get(createBookingDto.paymentType!);
    const paymentResult = await handler.payment(booking, booking.agencyId);
    return {
      booking: BookingMapper.toBookDto(booking),
      clientSecret: paymentResult.clientSecret || '',
    };
  }

  async fetchBookings(userId: string): Promise<FetchBookingDto[] | null> {
    let agency = await this._agencyRepo.findByUserId(userId);
    if (!agency) return null;
    let bookings = await this._bookingRepo.fetchBookingDetails(agency.id);
    console.log(bookings, 'bookings in booking.usecase');
    let userEntity = await Promise.all(
      bookings.map((booking) => this._userRepo.findById(booking.userId)),
    );
    console.log(userEntity, 'in booking.usecase');
    let filteredBooking = bookings.filter(
      (booking) => booking.agencyId != null,
    );
    console.log(filteredBooking);

    let packageEntity = await Promise.all(
      filteredBooking.map((booking) =>
        this._packageRepo.findBookedPackage(booking.agencyId!),
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
  ): Promise<(FetchUserBookingDto | undefined)[]> {
    let bookingEntity = await this._bookingRepo.findByUserId(userId);
    console.log(bookingEntity, 'Booking enityt in getUserBookibngs');

    if (!bookingEntity) return [];
    let packageEntity = await this._packageRepo.getAllPackages();
    console.log(packageEntity, 'in packkage getUserBookings');

    let packages = await Promise.all(
      bookingEntity.map((booking) =>
        packageEntity.find((pkg) => pkg.id == booking.packageId),
      ),
    );
    console.log(packages, 'pakcages in getUserBookingds');
    //ivde ipo 2 package und but njn pinne find use aakyond oru package filter aayi athinte name
    //mathre kittnollu
    let agencies = await Promise.all(
      bookingEntity.map((booking) => {
        if (booking) {
          return this._agencyRepo.findById(booking.agencyId);
        }
      }),
    );
    let filteredAgencies = agencies.filter(
      (agency) => agency !== null && agency !== undefined,
    );
    console.log(filteredAgencies, 'fitlered AGencies');

    let agencyUsers = await Promise.all(
      agencies.map((agency) => {
        if (agency) {
          return this._userRepo.findById(agency.userId);
        }
        return null;
      }),
    );

    let filteredAgencyUsers = agencyUsers.filter(
      (user) => user !== null && user !== undefined,
    );
    console.log(filteredAgencyUsers, 'fitlered Agency Users');

    return BookingMapper.toFetchUserBookingsDto(
      bookingEntity,
      packages,
      filteredAgencyUsers,
      filteredAgencies,
    );
  }

  async cancelBooking(id: string): Promise<BookingStatusDto | null> {
    let bookingEntity = await this._bookingRepo.findById(id);
    if (!bookingEntity) return null;
    let travelStartDate = new Date(bookingEntity.travelDate);
    const refundPercentage =
      RefundPolicyEntity.calculateRefund(travelStartDate);
    //refund wallet
    let updateBookingStatus = bookingEntity.updateBooking({
      status: BookingStatus.CANCELLED,
    });
    console.log(updateBookingStatus, 'update Booking Dstatus');

    let update = await this._bookingRepo.update(id, bookingEntity);

    console.log(update, 'updateeee in cancelt Booking');

    if (!update) return null;
    if (refundPercentage > 0) {
      let refundAmount = (bookingEntity.totalAmount * refundPercentage) / 100;
      console.log(refundAmount, 'refund Amount');
      let existingWallet = await this._walletRepo.findByUserId(
        bookingEntity.userId,
      );
      if (existingWallet) {
        await this._walletUsecase.addBalance(
          refundAmount,
          bookingEntity.userId,
          WalletTransactionEnum.REFUND,
        );
      } else {
        await this._walletUsecase.createWallet(
          refundAmount,
          bookingEntity.userId,
        );
        existingWallet = newWallet;
      }
      const walletTransactionEntity = WalletTransactionEntity.create({
      walletId:existingWallet?.id ?? '',
      amount: refundAmount,
      transactionType: Transaction.Credit,
      paymentStatus: PaymentStatus.REFUNDED,
      category:WalletTransactionEnum.REFUND,
      createdAt:new Date(),
      bookingId: bookingEntity.id,
      agencyId:bookingEntity.agencyId,
    });
    await this._walletTransactionRepo.create(walletTransactionEntity);
    }

    return BookingMapper.toUpdateBookingStatus(update);
  }

  async updateBookingStatus(
    bookingId: string,
    agencyId: string,
    status: BookingStatus,
  ): Promise<BookingEntity> {
    console.log(agencyId,'agencyId');
    console.log(bookingId,'bookingId');
    
    return await this._bookingRepo.updateStatus(bookingId, status);
  }

  async execute(packageId: string){
    let booking = await this._bookingRepo.findByPackageId(packageId);
    return BookingMapper.toResponseBookingDtoByPackageId(booking);
  }

  async paymentVerification(paymentIntentId:string){
    let transaction = await this._transactionRepo.findByPaymentIntent(paymentIntentId)
    console.log("Reached Payment Controller at:", new Date().toISOString());
    console.log(transaction,'-----trnasaction----')
    if(!transaction) return null
    return {
      status:transaction.status as PaymentStatus
    }
  }
}
