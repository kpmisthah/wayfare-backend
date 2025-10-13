import { Injectable, OnModuleInit } from "@nestjs/common";
import { IPayment } from "../interfaces/payment.interface";
import { CardPaymentUsecase } from "./card.payment.usecase";
import { WalletPaymentUsecase } from "./wallet.payment.usecase";

@Injectable()
export class PaymentRegistry implements OnModuleInit {
  private handlers = new Map<string, IPayment>();

  constructor(
    private _cardPayment: CardPaymentUsecase,
    private _walletPayment: WalletPaymentUsecase
  ) {}

  onModuleInit() {
    this.register("card", this._cardPayment);
    this.register("wallet", this._walletPayment);
  }

  register(type: string, handler: IPayment) {
    this.handlers.set(type, handler);
  }

  get(type: string): IPayment {
    const handler = this.handlers.get(type);
    if (!handler) throw new Error(`Unsupported payment type: ${type}`);
    return handler;
  }
}
