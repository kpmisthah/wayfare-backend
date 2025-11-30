import { preference } from '@prisma/client';
import { UserEntity } from 'src/domain/entities/user.entity';

export interface IAdminRepository {
  createPreference(preference: { name: string }): Promise<preference | null>;
  getAllPreferences(): Promise<preference[] | null>;
  findAdmin():Promise<UserEntity|null>
  findRecentBookings(limit: number)
}
