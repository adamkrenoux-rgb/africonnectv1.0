export interface Application {
  id: string;
  businessId: string;
  campaignId: string;
  description: string;
  mediaUrls: string[];
  aiInsights: string; // summary from AI on strengths/weaknesses
  createdAt: Date;
  updatedAt: Date;
}
