import { Timestamp } from "firebase/firestore";

export type Campaign = {
  brandId: string
  size: string;
  projectDescription: string;
  targetAudience: string;
  headline: string;
  punchline: string;
  callToAction: string;
  exampleImage: string;
  generatedImage: string;
}

export type Statistics = {
  campaignId: string, 
  clicks: number,
  impressions: number,
  conversionRate: number,
  totalCost: number,
  timestamp: Timestamp
}