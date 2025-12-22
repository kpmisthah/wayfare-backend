import { Role } from '../enums/role.enum';

export class UserEntity {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _email: string,
    private readonly _password: string,
    private readonly _role: Role,
    private readonly _isBlock: boolean,
    private readonly _isVerified: boolean,
    private readonly _lastSeen: Date | null = null,
    private readonly _phone?: string | null,
    private readonly _profileImage?: string,
    private readonly _bannerImage?: string,
    private readonly _refreshToken?: string,
  ) {
  }

  static create(props: {
    name: string;
    email: string;
    password: string;
    phone: string;
    refreshToken?: string | undefined;
    isBlock?: boolean;
    role: Role;
    isVerified?: boolean;
  }) {
    if (!props.email.includes('@')) {
      throw new Error('Invalid email');
    }
    if (!props.name || props.name.trim() == '') {
      throw new Error('Invalid name');
    }
    return new UserEntity(
      '',
      props.name,
      props.email,
      props.password,
      props.role,
      props.isBlock ?? false,
      props.isVerified ?? false,
      null,
      props.phone ?? '',
      '',
      '',
      props.refreshToken,
    );
  }

  public update(props: {
    name?: string;
    email?: string;
    password?: string;
    isVerified?: boolean;
    refreshToken?: string;
    isBlock?: boolean;
  }): UserEntity {
    if (props.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email)) {
      throw new Error('Invalid email format');
    }
    if (props.password && props.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    return new UserEntity(
      this._id,
      props.name ?? this._name,
      props.email ?? this._email,
      props.password ?? this._password,
      this._role,
      props.isBlock ?? this._isBlock,
      props.isVerified ?? this._isVerified,
      null,
      this._phone,
      this._profileImage,
      this._bannerImage,
      props.refreshToken ?? this._refreshToken,
    );
  }
  public updateUserStatus(props: { isBlock: boolean }): UserEntity {
    return new UserEntity(
      this._id,
      this._name,
      this._email,
      this._password,
      this._role,
      props.isBlock,
      this._isVerified,
      null,
      this._phone,
      this._profileImage,
      this._bannerImage,
      this._refreshToken,
    );
  }

  static ensurePasswordMatch(pw: string, cpw: string) {
    if (pw != cpw) throw new Error('password do not match');
  }

  //getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get role(): Role {
    return this._role;
  }

  get isBlock(): boolean {
    return this._isBlock;
  }
  get profileImage(): string {
    return this._profileImage ?? '';
  }
  get bannerImage(): string {
    return this._bannerImage ?? '';
  }

  get refreshToken(): string {
    return this._refreshToken ?? '';
  }
  get password(): string {
    return this._password ?? '';
  }
  get isVerified(): boolean {
    return this._isVerified;
  }
  get phone(): string {
    return this._phone ?? '';
  }
  get lastSeen() {
    return this._lastSeen;
  }

  // getHashedPassword(): string | null {
  //   return this._password;
  // }
}
