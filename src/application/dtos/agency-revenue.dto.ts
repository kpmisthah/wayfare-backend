export class AgencyRevenueDTO {
  agencyId: string;
  agencyName: string;
  platformEarning: number;
  all: number;
}
// Type '{ agencyId: string; agencyName: string;
// platfromEarning: number | null; all: number; }[]' is not assignable to
//  type 'AgencyRevenueDTO[]'.
//   Type '{ agencyId: string; agencyName: string; platfromEarning:
//   number | null; all: number; }'
//   is missing the following properties from type
//   'AgencyRevenueDTO': platformEarning, totalBookingsts(2322)
