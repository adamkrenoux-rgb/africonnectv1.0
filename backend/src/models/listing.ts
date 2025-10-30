export interface Listing {
  id: string;
  businessId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  mediaUrls: string[];
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
