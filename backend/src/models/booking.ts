export interface Booking {
  id: string;
  travelerId: string;
  businessId: string;
  listingId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
