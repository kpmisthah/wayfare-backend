import { BadRequestException } from '@nestjs/common';

export class WalletEntity {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _balance: number,
  ) {}
  static create(props: { userId: string; balance: number }) {
    if (props.balance < 0) {
      throw new Error('wallet Balance cannot be less than 0');
    }
    return new WalletEntity('', props.userId, props.balance);
  }

  public updateWallet(props: { balance: number }) {
    return new WalletEntity(
      this._id,
      this._userId,
      props.balance ?? this._balance,
    );
  }
  public debit(totalAmount: number) {
    if (this._balance < totalAmount) {
      throw new BadRequestException('Insufficient balance');
    }
    return new WalletEntity(
      this._id,
      this._userId,
      this._balance - totalAmount,
    );
  }
  //getters
  get id() {
    return this._id;
  }
  get userId() {
    return this._userId;
  }
  get balance() {
    return this._balance;
  }
}
