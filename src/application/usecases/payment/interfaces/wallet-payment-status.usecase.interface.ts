export interface IWalletPaymentStatus {
  releasePendingCredits(): Promise<void>;
}
