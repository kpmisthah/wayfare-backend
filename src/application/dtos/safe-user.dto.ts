import { Role } from "src/domain/enums/role.enum";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  isBlock: boolean;
  role:Role
};
