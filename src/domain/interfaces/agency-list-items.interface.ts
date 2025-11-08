export interface AgencyListItem {
  id: string;
  phone: string;
  specialization: string[];
  description: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
}
