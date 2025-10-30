export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'traveler' | 'business' | 'influencer';
  createdAt: Date;
  updatedAt: Date;
  // Add more fields as needed for profile
}
