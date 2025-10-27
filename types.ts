
export interface Location {
  latitude: number;
  longitude: number;
}

export enum MotorcycleStatus {
  Stolen = 'ROBADA',
  Recovered = 'RECUPERADA',
}

export interface Motorcycle {
  id: string; // Using plate as a unique ID
  plate: string;
  status: MotorcycleStatus;
  theftLocation: Location;
  theftDate: string;
  recoveryLocation?: Location;
  recoveryDate?: string;
}
