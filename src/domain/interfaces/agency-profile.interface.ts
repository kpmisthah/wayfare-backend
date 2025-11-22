export interface AgencyProfile {
  id: string;
  phone: string;
  status: string;
  specialization: string[];
  description: string | null;
  user: {
    name: string;
    email: string;
  };
}
