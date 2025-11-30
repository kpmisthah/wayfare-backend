
export interface DashboardCards {
  totalUsers: number;
  totalBookings: number;
  totalAgencies: number;
  totalRevenue: number;
}


export interface RevenueDataPoint {
  month: string;
  revenue: number;
  bookings: number;
}


export interface BookingStatusDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface DashboardStats {
  cards: DashboardCards;
  charts: {
    revenueOverview: RevenueDataPoint[];
    bookingStatusOverview: BookingStatusDataPoint[];
  };
}
