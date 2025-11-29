import { BadRequestException, Inject, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
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
import { IWalletTransactionRepository } from 'src/domain/repositories/wallet/wallet-transaction.repository.interface';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { Transaction } from 'src/domain/enums/transaction.enum';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { BookingResponseDto } from 'src/application/dtos/booking-details-response.dto';

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
    @Inject('IWalletTransactionRepo')
    private readonly _walletTransactionRepo: IWalletTransactionRepository,
  ) {}

  async createBooking(
    createBookingDto: BookingDto,
    userId: string,
  ): Promise<{ booking: CreateBookingDto; checkoutUrl: string } | null> {
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
      checkoutUrl: paymentResult.checkoutUrl || '',
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
    page: number,
    limit: number,
  ): Promise<{ data: (FetchUserBookingDto|undefined)[]; totalPages: number; page: number }> {
    console.log(page,'pageee',limit,'limitttt')
    let bookingEntity = await this._bookingRepo.findByUserId(userId);
      if (!bookingEntity || bookingEntity.length === 0) {
    return { data: [], totalPages: 0,page };
  }
    const totalBookings = bookingEntity.length;
    console.log(totalBookings,'totalbookingss')
    const totalPages = Math.ceil(totalBookings / limit);
    console.log(totalPages,'totalpagesss')
    const startIndex = (page - 1) * limit;
    console.log(startIndex,'startindexxx')  
    const endIndex = page * limit;
    console.log(endIndex,'endindexxx')
    const paginatedBookings = bookingEntity.slice(startIndex, endIndex);
    console.log(paginatedBookings,'paginatedbookingss')
    let packageEntity = await this._packageRepo.getAllPackages();
    console.log(packageEntity,'packageentityyyy')
    let packages = await Promise.all(
      paginatedBookings.map((booking) =>
        packageEntity.find((pkg) => pkg.id == booking.packageId),
      ),
    );
    console.log(packages,'packagesin userbookingsss')
    let agencies = await Promise.all(
      paginatedBookings.map((booking) => {
        if (booking) {
          return this._agencyRepo.findById(booking.agencyId);
        }
      }),
    );
    console.log(agencies,'agenciesin userbookingss')
    let filteredAgencies = agencies.filter(
      (agency) => agency !== null && agency !== undefined,
    );

    console.log(filteredAgencies,'filtered agenciesin userbookingss')
    let agencyUsers = await Promise.all(
      agencies.map((agency) => {
        if (agency) {
          return this._userRepo.findById(agency.userId);
        }
        return null;
      }),
    );
    console.log(agencyUsers,'agency usersin userbookingss')
    let filteredAgencyUsers = agencyUsers.filter(
      (user) => user !== null && user !== undefined,
    );
    console.log(filteredAgencyUsers,'filtered agency usersin userbookingss')
    let mapped = BookingMapper.toFetchUserBookingsDto(
      paginatedBookings,
      packages,
      filteredAgencyUsers,
      filteredAgencies,
    );
    console.log(mapped,'mapped in usecase')
    return{
      data:mapped,
      totalPages,
      page
    }
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

    let update = await this._bookingRepo.update(id, updateBookingStatus);

    console.log(update, 'updateeee in cancelt Booking');

    if (!update) return null;
    if (refundPercentage > 0) {
      let refundAmount = (bookingEntity.totalAmount * refundPercentage) / 100;
      console.log(refundAmount, 'refund Amount');
      let existingWallet = await this._walletUsecase.findByUserId(
        bookingEntity.userId,
      );
      console.log(existingWallet, 'existing wallet in cancel booking');
      if (existingWallet?.userId!='') {
        await this._walletUsecase.addBalance(
          refundAmount,
          bookingEntity.userId,
          WalletTransactionEnum.REFUND,
          bookingEntity.id,
          PaymentStatus.SUCCEEDED
        );
      } else {
        let newWallet = await this._walletUsecase.createWallet(
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
    console.log(agencyId, 'agencyId');
    console.log(bookingId, 'bookingId');

    return await this._bookingRepo.updateStatus(bookingId, status);
  }

  async execute(packageId: string){
    let booking = await this._bookingRepo.findByPackageId(packageId);
    return BookingMapper.toResponseBookingDtoByPackageId(booking);
  }

  async paymentVerification(bookingId:string){
    let transaction = await this._transactionRepo.findByBookingId(bookingId)
    console.log("Reached Payment Controller at:", new Date().toISOString());
    console.log(transaction,'-----trnasaction----')
    if(!transaction) return null
    return {
      status:transaction.status as PaymentStatus
    }
  }

  async getUserBookingDetails(id:string):Promise<BookingResponseDto|null>{
    let getBookingDetails = await this._bookingRepo.fetchUserBookingDetails(id)
    console.log(getBookingDetails,'getBookingdetailss')
    if(!getBookingDetails){
      return null
    }
    return BookingMapper.toBookingResponseDto(getBookingDetails)
  }

  async retryPayment(bookingId:string,userId:string):Promise<{url:string}>{
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking || booking.userId !== userId) {
    throw new NotFoundException('Booking not found');
  }

  if(booking.status != BookingStatus.PENDING){
    throw new BadRequestException("cannot retry payment")
  }
  const handler = this._paymentRegistry.get('card');
  const result = await handler.payment(booking, booking.agencyId);
  if(!result.checkoutUrl){
    throw new BadRequestException("checkoutUrl is not found")
  }
  return { url: result.checkoutUrl };
  }
}
