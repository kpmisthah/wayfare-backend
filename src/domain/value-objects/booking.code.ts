import { customAlphabet } from 'nanoid';

const alphabet = '34679ACDEFHJKLMNPRTUVWXY';
const nanoid = customAlphabet(alphabet, 7);

export class BookingCode {
  private constructor(private readonly _value: string) {}

  static generate(prefix = 'BKG'): BookingCode {
    const code = `${prefix}-${nanoid()}`.toUpperCase();
    return new BookingCode(code);
  }

  static fromString(value: string): BookingCode {
    const normalized = value.toUpperCase();
    if (!/^BKG-[34679ACDEFHJKLMNPRTUVWXY]{7}$/.test(normalized)) {
      throw new Error(`Invalid booking code format: ${value}`);
    }
    return new BookingCode(normalized);
  }

  toString(): string {
    return this._value;
  }

  equals(other: BookingCode): boolean {
    return this._value === other._value;
  }
}
