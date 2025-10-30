export interface AIOutput {
  id: string;
  userId: string;
  relatedEntityId: string; // what the output is about (booking, campaign, etc)
  outputType: 'trip-plan' | 'listing-optimizer' | 'campaign-projection';
  data: any;
  createdAt: Date;
}
