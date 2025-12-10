import { PaymentStatus } from '../enums/payment-status.enum';
import { Transaction } from '../enums/transaction.enum';
import { WalletTransactionEnum } from '../enums/wallet-transaction.enum';

export class WalletTransactionEntity {
  constructor(
    private readonly _id: string,
    private readonly _walletId: string,
    private readonly _amount: number,
    private readonly _transactionType: Transaction,
    private readonly _paymentStatus: PaymentStatus,
    private readonly _category: WalletTransactionEnum,
    private readonly _createdAt: Date,
    private readonly _bookingId?: string,
    private readonly _agencyId?: string | undefined,
  ) {}

  static create(props: {
    walletId: string;
    amount: number;
    transactionType: Transaction;
    paymentStatus: PaymentStatus;
    category: WalletTransactionEnum;
    createdAt: Date;
    bookingId: string;
    agencyId: string | undefined;
  }) {
    return new WalletTransactionEntity(
      '',
      props.walletId,
      props.amount,
      props.transactionType,
      props.paymentStatus,
      props.category,
      props.createdAt,
      props.bookingId,
      props.agencyId,
    );
  }

  public updateWalletTransaction(props: { status: PaymentStatus,deductAmount?:number }) {
    const updatedAmount =
    props.deductAmount !== undefined
      ? this._amount - props.deductAmount
      : this._amount;
    return new WalletTransactionEntity(
      this._id,
      this._walletId,
      updatedAmount ?? this._amount,
      this._transactionType,
      props.status ?? this._paymentStatus,
      this._category,
      this._createdAt,
      this._bookingId,
      this._agencyId,
    );
  }
  //getter
  get id() {
    return this._id;
  }
  get walletId() {
    return this._walletId;
  }
  get amount() {
    return this._amount;
  }
  get transactionType() {
    return this._transactionType;
  }
  get paymentStatus() {
    return this._paymentStatus;
  }
  get agencyId() {
    return this._agencyId;
  }
  get bookingId() {
    return this._bookingId;
  }
  get category() {
    return this._category;
  }
  get createdAt() {
    return this._createdAt;
  }
}
