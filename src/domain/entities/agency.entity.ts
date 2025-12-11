import { AgencyStatus } from '../enums/agency-status.enum';

export class AgencyEntity {
  constructor(
    private readonly _id: string,
    private readonly _description: string | null,
    // private readonly _status: AgencyStatus,
    // private readonly _specialization:string[],
    // private readonly _phone:string,
    // private readonly _role:Role,
    private readonly _userId: string,
    private readonly _pendingPayouts: number,
    private readonly _totalEarnings: number,
    private readonly _address: string | null,
    private readonly _licenseNumber?: string,
    private readonly _ownerName?: string,
    private readonly _websiteUrl?: string,
    private readonly _transactionId?: string | null,
    private readonly _reason?: string | null,
    private readonly _bannerImage?: string | null,
    private readonly _profileImage?: string | null,
  ) {}

  static create(props: {
    description: string;
    // status:AgencyStatus,
    // specialization:string[],
    // phone:string,
    // role:Role,
    userId: string;
    pendingPayouts: number;
    totalEarnings: number;
    address: string;
    licenseNumber?: string;
    ownerName?: string;
    websiteUrl?: string;
    transactionId: string | null;
  }) {
    if (!props.description) {
      throw new Error('Description is mandatory');
    }
    // if(!props.phone){
    //     throw new Error("Phone number is mandatory")
    // }
    return new AgencyEntity(
      '',
      props.description,
      // props.status,
      // props.specialization,
      // props.phone,
      // props.role,
      // AgencyStatus.ACTIVE,
      props.userId,
      props.pendingPayouts,
      props.totalEarnings,
      props.address,
      props.licenseNumber,
      props.ownerName,
      props.websiteUrl,
      props.transactionId,
    );
  }

  public updateAgency(props: {
    status?: AgencyStatus;
    reason?: string | null;
  }) {
    console.log(props.reason, 'reaaspm');
    return new AgencyEntity(
      this._id,
      this._description,
      // props.status,
      // this._specialization,
      // this._phone,
      // this._role,
      this._userId,
      this._pendingPayouts,
      this._totalEarnings,
      this._address,
      this._licenseNumber,
      this._ownerName,
      this._websiteUrl,
      this._transactionId,
      props.reason ?? this._reason,
    );
  }
  public updateAgencyProfile(props: {
    description?: string;
    phone?: string;
    specialization?: string[];
    address?: string;
    licenseNumber?: string;
    ownerName?: string;
    websiteUrl?: string;
  }) {
    return new AgencyEntity(
      this._id,
      props.description ?? this._description,
      // this._status,
      //    props.specialization ?? this._specialization,
      //    props.phone ?? this._phone,
      //    this._role,
      this._userId,
      this._pendingPayouts,
      this._totalEarnings,
      props.address ?? this._address,
      props.licenseNumber ?? this._licenseNumber,
      props.ownerName ?? this._ownerName,
      props.websiteUrl ?? this._websiteUrl,
      this._transactionId,
    );
  }
  //getters
  get id() {
    return this._id;
  }
  get description() {
    return this._description;
  }
  // get status() {
  //   return this._status;
  // }
  // get specialization(){
  //     return this._specialization
  // }
  // get phone(){
  //     return this._phone
  // }
  get pendingPayouts() {
    return this._pendingPayouts;
  }
  get totalEarnings() {
    return this._totalEarnings;
  }
  // get role(){
  //     return this._role
  // }

  get transactionId() {
    return this._transactionId;
  }
  get userId() {
    return this._userId;
  }
  get address() {
    return this._address;
  }
  get licenseNumber() {
    return this._licenseNumber;
  }
  get ownerName() {
    return this._ownerName;
  }
  get websiteUrl() {
    return this._websiteUrl;
  }
  get reason() {
    return this._reason;
  }
  get bannerImage() {
    return this._bannerImage;
  }
  get profileImage() {
    return this._profileImage;
  }
}
