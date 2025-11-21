'use server';
import { config } from 'dotenv';
config();

// Import the flows
import '@/ai/flows/personalized-activity-recommendations.ts';
import '@/ai/flows/ai-assisted-room-upgrade-suggestions.ts';
