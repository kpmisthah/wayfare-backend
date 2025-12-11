import { BookingStatus } from '../enums/booking-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { BookingCode } from '../value-objects/booking.code';

export class BookingEntity {
  constructor(
    private readonly _id: string,
    private readonly _packageId: string,
    private readonly _userId: string,
    private readonly _peopleCount: number,
    private readonly _totalAmount: number,
    private readonly _isCancellationAllowed: boolean,
    private readonly _status: BookingStatus,
    private readonly _travelDate: string,
    private readonly _agencyId: string,
    private readonly _commission: number,
    private readonly _platformEarning: number,
    private readonly _agencyEarning: number,
    private readonly _bookingCode: BookingCode,
    private readonly _customerName?: string,
    private readonly _customerEmail?: string,
    private readonly _phone?: string,
    private readonly _destination?: string,
    private readonly _title?: string,
    private readonly _duration?: number,
  ) {}
  static create(props: {
    packageId: string;
    userId: string;
    peopleCount: number;
    totalAmount: number;
    isCancellationAllowed: boolean;
    status: BookingStatus;
    agencyId: string;
    travelDate: string;
    commission: number;
  }) {
    console.log(props, 'props in create');
    const platformEarning = (props.totalAmount * props.commission) / 100;
    const agencyEarning = props.totalAmount - platformEarning;
    return new BookingEntity(
      '',
      props.packageId,
      props.userId,
      props.peopleCount,
      props.totalAmount,
      props.isCancellationAllowed,
      props.status,
      props.travelDate,
      props.agencyId,
      props.commission,
      platformEarning,
      agencyEarning,
      BookingCode.generate('BKG'),
    );
  }

  public updateBooking(props: { status: BookingStatus }) {
    return new BookingEntity(
      this._id,
      this._packageId,
      this._userId,
      this._peopleCount,
      this._totalAmount,
      this._isCancellationAllowed,
      props.status ?? this._status,
      this._travelDate,
      this._agencyId,
      this._commission,
      this._platformEarning,
      this._agencyEarning,
      this._bookingCode,
      this._customerName,
      this._customerEmail,
      this._phone,
    );
  }

  public getAgencyCreditStatus():
    | PaymentStatus.PENDING
    | PaymentStatus.SUCCEEDED {
    const travelDate = new Date(this._travelDate);
    const safeDate = new Date(travelDate);
    safeDate.setDate(safeDate.getDate() - 4);
    const today = new Date();

    return today >= safeDate ? PaymentStatus.SUCCEEDED : PaymentStatus.PENDING;
  }

  ///getters
  get id() {
    return this._id;
  }
  get packageId() {
    return this._packageId;
  }
  get userId() {
    return this._userId;
  }

  get peopleCount() {
    return this._peopleCount;
  }
  get totalAmount() {
    return this._totalAmount;
  }
  get isCancellation() {
    return this._isCancellationAllowed;
  }
  get status() {
    return this._status;
  }
  get travelDate() {
    return this._travelDate;
  }
  // get paymentIndentedId(){
  //     return this._paymentIndentedId
  // }
  get agencyId() {
    return this._agencyId;
  }

  get commission() {
    return this._commission;
  }

  get platformEarning() {
    return this._platformEarning;
  }

  get agencyEarning() {
    return this._agencyEarning;
  }
  get customerName() {
    return this._customerName;
  }
  get customerEmail() {
    return this._customerEmail;
  }
  get phone() {
    return this._phone;
  }
  get destination() {
    return this._destination;
  }
  get title() {
    return this._title;
  }
  get duration() {
    return this._duration;
  }
  get bookingCode() {
    return this._bookingCode;
  }
}
