export interface Report {
  id: string;
  driverFirstName?: string;
  driverLastName?: string;
  licensePlate: string;
  position: [number, number]; // [lat, lng]
  comment: string;
  route: {
    start: string;
    end: string;
  };
  imageUrl?: string;
  createdAt: string;
}