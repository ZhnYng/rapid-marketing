import { Timestamp } from "firebase/firestore";

export type Campaign = {
  brandId: string;
  version: number;
  size: string;
  projectDescription: string;
  targetAudience: string;
  headline: string;
  punchline: string;
  callToAction: string;
  exampleImage: string;
  generatedImage: string;
  analysisId: string;
}

export type Statistics = {
  campaignId: string;
  clicks: number;
  impressions: number;
  conversionRate: number;
  totalCost: number;
  timestamp: Timestamp;
}

export type Analysis = {
  analysisId: string;
  campaignId1: string;
  campaignId2: string;
  difference: string;
  suggestions: string;
}

export type Account = {
  id: string;
  email: string;
  openaiAPIKey: string;
}

export type Brand = {
  id: string;
  brandName: string;
  brandType: string;
  brandDescription: string;
  brandLogo: string;
}