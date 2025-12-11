import { PayoutStatus } from '../enums/payout-status.enum';

// domain/entities/payout-request.entity.ts
export class PayoutRequestEntity {
  constructor(
    private readonly _id: string,
    private readonly _agencyId: string,
    private readonly _amount: number,
    private readonly _status: PayoutStatus,
    private readonly _rejectionReason?: string,
  ) {}

  static create(props: { agencyId: string; amount: number }) {
    return new PayoutRequestEntity(
      '',
      props.agencyId,
      props.amount,
      PayoutStatus.PENDING,
    );
  }
  public update(props: { status?: PayoutStatus; rejectionReason?: string }) {
    return new PayoutRequestEntity(
      this._id,
      this._agencyId,
      this._amount,
      props.status ?? this._status,
      props.rejectionReason ?? this._rejectionReason,
    );
  }

  get id() {
    return this._id;
  }
  get agencyId() {
    return this._agencyId;
  }
  get amount() {
    return this._amount;
  }
  get status() {
    return this._status;
  }
  get rejectionReason() {
    return this._rejectionReason;
  }
}
