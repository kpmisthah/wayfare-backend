export class TransportationEntity {
  constructor(
    private readonly _id: string,
    private readonly _vehicle: string,
    private readonly _pickup_point: string,
    private readonly _drop_point: string,
    private readonly _details: string,
    // private readonly _package:string
  ) {}

  static create(props: {
    vehicle: string;
    pickup_point: string;
    drop_point: string;
    details: string;
    // package:string
  }) {
    return new TransportationEntity(
      '',
      props.vehicle,
      props.pickup_point,
      props.drop_point,
      props.details,
    );
  }
  public update(props:{
    vehicle?:string,
    pickup_point?:string,
    drop_point?:string,
    details?:string
  }) {
    return new TransportationEntity(
      this._id,
      props.vehicle ?? this._vehicle,
      props.pickup_point ?? this._pickup_point,
      props.drop_point ?? this._drop_point,
      props.details ?? this._details
    )
  }
  //getters
  get id() {
    return this._id;
  }

  get vehicle() {
    return this._vehicle;
  }
  get pickup_point() {
    return this._pickup_point;
  }
  get drop_point() {
    return this._drop_point;
  }
  get details() {
    return this._details;
  }
  // get packageId(){
  //     return this._package
  // }
}
