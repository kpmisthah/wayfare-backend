export class RefundPolicyEntity {
  static calculateRefund(travelDate: Date): number {
    const start = travelDate.getTime();
    const current = new Date().getTime();
    const timeDifference = start - current;
    const duration = timeDifference / (1000 * 3600 * 24);
    if (duration > 7) {
      return 100;
    }
    if (duration >= 4 && duration < 7) {
      return 50;
    }
    return 0;
  }
}
