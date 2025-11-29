import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user/user.repository';
import { AuthRepository } from './repositories/auth/auth.repository';
import { UserVerificationRepository } from './repositories/user/userVerification.repository';
import { AgencyRepository } from './repositories/agency/agency.repository';
import { ProfileRepository } from './repositories/user/profile.repository';
import {
  ADMIN_TYPE,
  AGENCY_PACKAGE_TYPE,
  AGENCY_PROFILE_TYPE,
  PROFILE_TYPE,
} from 'src/domain/types';
import { AdminRepository } from './repositories/admin/admin.repository';
import { AgencyPackageRepository } from './repositories/agency/agency-package.repository';
import { AgencyProfileRepository } from './repositories/agency/agency-profile.repository';
import { ArgonService } from 'src/infrastructure/utils/argon.service';
import { NodemailerService } from 'src/infrastructure/utils/nodemailer.service';
import { ItineraryRepository } from './repositories/agency/itinerary';
import { TransportationRepository } from './repositories/agency/tranportation';
import { AiModal } from 'src/infrastructure/utils/aiModal.service';
import { TripRepository } from './repositories/trip/trip.repository';
import { BookingRepository } from './repositories/booking/booking.repository';
import { StripeService } from 'src/infrastructure/utils/stripe.service';
import { TransactionRepository } from './repositories/transaction/transaction.repository';
import { WalletRepository } from './repositories/wallet/wallet.repository';
import { WalletTransactionRepository } from './repositories/wallet/wallet.transaction.repository';
import { AdminRevenueRepository } from './repositories/admin/admin-revenue.reposiotry';
import { AgenciesRevenueRepository } from './repositories/admin/agency-revenue.repository';
import { GoogleStrategy } from 'src/infrastructure/common/strategies/google.strategy';
import { ConnectionRepository } from './repositories/connection/connection.repository';
import { ConversationRepository } from './repositories/conversation/conversation.repository';
import { MessageRepository } from './repositories/chat/message.repository';
import { AgencyBankDetailsRepository } from './repositories/agency/agency-bank-details.repository';
import { PayoutRequestRepository } from './repositories/agency/payout-request.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    GoogleStrategy,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    {
      provide: 'IUserVerification',
      useClass: UserVerificationRepository,
    },
    {
      provide: 'IAgencyRepository',
      useClass: AgencyRepository,
    },
    {
      provide: PROFILE_TYPE.IProfileRepository,
      useClass: ProfileRepository,
    },
    {
      provide: ADMIN_TYPE.IAdminRepository,
      useClass: AdminRepository,
    },
    {
      provide: AGENCY_PACKAGE_TYPE.IAgencyPackageRepository,
      useClass: AgencyPackageRepository,
    },
    {
      provide: AGENCY_PROFILE_TYPE.IAgencyProfileRepository,
      useClass: AgencyProfileRepository,
    },
    {
      provide: 'IArgonService',
      useClass: ArgonService,
    },
    {
      provide: 'INodeMailerService',
      useClass: NodemailerService,
    },
    {
      provide: 'IIteneraryRepository',
      useClass: ItineraryRepository,
    },
    {
      provide: 'ITransportationRepository',
      useClass: TransportationRepository,
    },
    {
      provide: 'IAiModel',
      useClass: AiModal,
    },
    {
      provide: 'ITripRepository',
      useClass: TripRepository,
    },
    {
      provide:'IBookingRepository',
      useClass:BookingRepository
    },
    {
      provide:"ITransactionRepository",
      useClass:TransactionRepository
    },{
      provide:'IStripeService',
      useClass:StripeService
    },
    {
      provide:'IWalletRepository',
      useClass:WalletRepository
    },
    {
      provide:"IWalletTransactionRepo",
      useClass:WalletTransactionRepository
    },
    {
      provide:"IAdminRevenueRepository",
      useClass:AdminRevenueRepository
    },
    {
      provide:"IAgenciesRevenueRepository",
      useClass:AgenciesRevenueRepository
    },
    {
      provide:"IConnectionRepository",
      useClass:ConnectionRepository
    },
    {
      provide:"IConversationRepository",
      useClass:ConversationRepository
    },
    {
      provide:"IMessageRepository",
      useClass:MessageRepository
    },
    {
      provide:"IBankingDetailsRepository",
      useClass:AgencyBankDetailsRepository
    },
    {
      provide:'IPayoutRequestRepository',
      useClass:PayoutRequestRepository
      
    }
  ],
  exports: [
    PrismaService,
    GoogleStrategy,
    'IUserRepository',
    'IAuthRepository',
    'IUserVerification',
    'IAgencyRepository',
    'IArgonService',
    'INodeMailerService',
    'IIteneraryRepository',
    'ITransportationRepository',
    'IAiModel',
    'ITripRepository',
    'IBookingRepository',
    'ITransactionRepository',
    'IStripeService',
    'IWalletRepository',
    'IWalletTransactionRepo',
    'IAdminRevenueRepository',
    'IAgenciesRevenueRepository',
    'IConnectionRepository',
    'IConversationRepository',
    'IMessageRepository',
    'IBankingDetailsRepository',
    'IPayoutRequestRepository',
    PROFILE_TYPE.IProfileRepository,
    ADMIN_TYPE.IAdminRepository,
    AGENCY_PACKAGE_TYPE.IAgencyPackageRepository,
    AGENCY_PROFILE_TYPE.IAgencyProfileRepository,
  ],
})
export class PrismaModule {}
