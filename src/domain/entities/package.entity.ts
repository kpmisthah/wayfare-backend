import { PackageStatus } from '../enums/package-status.enum';
import { TransportationEntity } from './transportation.entity';
export class PackageEntity {
  constructor(
    private readonly _id: string,
    private readonly _agencyId: string,
    private readonly _itineraryName: string,
    private readonly _description: string,
    private readonly _highlights: string,
    private readonly _picture: string[],
    private readonly _duration: number,
    private readonly _destination: string,
    private readonly _status: PackageStatus,
    private readonly _price: number,
    private readonly _transportationId: string,
    // private readonly _transportation?: TransportationEntity | null,
  ) {}

  static create(props: {
    agencyId: string;
    itineraryName: string;
    description: string;
    highlights: string;
    picture: string[];
    duration: number;
    destination: string;
    status: PackageStatus;
    price: number;
    transportationId: string;
    // transportationEntity:TransportationEntity
  }) {
    return new PackageEntity(
      '',
      props.agencyId,
      props.itineraryName,
      props.description,
      props.highlights,
      props.picture,
      props.duration,
      props.destination,
      props.status,
      props.price,
      props.transportationId,
      // props.transportationEntity
    );
  }

  public update(props:{
    name?:string,
    destination?:string,
    duration?:number,
    status?:PackageStatus
  }):PackageEntity{
    return new PackageEntity(
      this._id,
      this._agencyId,
      props.name ?? '',
      this._description,
      this._highlights,
      this._picture,
      props.duration ?? this._duration,
      props.destination ?? '',
      props.status!,
      this._price,
      this._transportationId
    )
  }

  //getters
  get id(): string {
    return this._id;
  }
  get agencyId(): string {
    return this._agencyId;
  }
  get itineraryName(): string {
    return this._itineraryName;
  }
  get description(): string {
    return this._description;
  }
  get highlights(): string {
    return this._highlights;
  }
  get picture() {
    return this._picture;
  }
  get duration(): number {
    return this._duration;
  }
  get destination(): string {
    return this._destination;
  }
  get status(): PackageStatus {
    return this._status;
  }
  get price(): number {
    return this._price;
  }
  get transportationId() {
    return this._transportationId;
  }
  // get transportation() {
  //   return this._transportation;
  // }
}
