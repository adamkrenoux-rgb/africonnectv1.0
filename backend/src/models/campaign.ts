export interface Campaign {
  id: string;
  influencerId: string;
  title: string;
  description: string;
  targetRegion: string;
  deliverables: string[];
  demographics: string;
  terms: string;
  createdAt: Date;
  updatedAt: Date;
}
