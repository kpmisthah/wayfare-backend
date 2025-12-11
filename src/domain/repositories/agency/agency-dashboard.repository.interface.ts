export interface DashboardStats {
  totalPackages: number;
  activeBookings: number;
  totalRevenue: number;
  happyCustomers: number;
}

export interface RecentBooking {
  id: string;
  customerName: string;
  destination: string;
  date: Date;
  totalCost: number;
  status: string;
}

export interface RecentReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  packageName: string;
  date: Date;
}

export interface AgencyDashboardData {
  stats: DashboardStats;
  recentBookings: RecentBooking[];
  recentReviews: RecentReview[];
}

export interface IAgencyDashboardRepository {
  getDashboardData(userId: string): Promise<AgencyDashboardData>;
}
