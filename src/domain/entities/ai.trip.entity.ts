import { DayPlan, Hotel } from '../types/ai.trip.type';

export class AiTripEntity {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _duration: string,
    private readonly _destination: string,
    private readonly _budget: string,
    private readonly _travelerType: string,
    private readonly _hotels: Hotel[],
    private readonly _itinerary: DayPlan[],
    private readonly _startDate: string,
    private readonly _visibility: boolean,
    private readonly _preferences?: {
      activities?: string[];
      pace?: string;
      interests?: string[];
    } | null,
    private readonly _userName?: string,
    private readonly _profileImage?: string,
    private readonly _location?: string,
  ) {}

  static create(props: {
    userId: string;
    duration: string;
    destination: string;
    budget: string;
    travelerType: string;
    hotels: Hotel[];
    itinerary: DayPlan[];
    startDate: string;
    visibility: boolean;
    preferences?: {
      activities?: string[];
      pace?: string;
      interests?: string[];
    } | null;
  }) {
    console.log(props, 'in entrity');

    return new AiTripEntity(
      '',
      props.userId,
      props.duration,
      props.destination,
      props.budget,
      props.travelerType,
      props.hotels,
      props.itinerary,
      props.startDate,
      props.visibility,
      props.preferences,
    );
  }
  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }
  get destination() {
    return this._destination;
  }
  get budget() {
    return this._budget;
  }
  get travelerType() {
    return this._travelerType;
  }
  get hotels() {
    return this._hotels;
  }
  get itinerary() {
    return this._itinerary;
  }
  get duration() {
    return this._duration;
  }

  get startDate() {
    return this._startDate;
  }

  get visibility() {
    return this._visibility;
  }

  get preferences() {
    return this._preferences;
  }

  get userName() {
    return this._userName;
  }

  get profileImage() {
    return this._profileImage;
  }

  get location() {
    return this._location;
  }
}
