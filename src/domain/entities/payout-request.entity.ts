import { PayoutStatus } from '../enums/payout-status.enum';

// domain/entities/payout-request.entity.ts
export class PayoutRequestEntity {
  constructor(
    private readonly _id: string,
    private readonly _agencyId: string,
    private readonly _amount: number,
    private readonly _status: PayoutStatus,
  ) {}

  static create(props: { agencyId: string; amount: number }) {
    return new PayoutRequestEntity(
      '',
      props.agencyId,
      props.amount,
      PayoutStatus.PENDING,
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
}
