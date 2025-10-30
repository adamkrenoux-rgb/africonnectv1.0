export interface Verification {
  id: string;
  businessId: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  reviews: string[];
  submittedAt: Date;
  updatedAt: Date;
}
