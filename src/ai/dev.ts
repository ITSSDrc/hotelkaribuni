'use server';
import { config } from 'dotenv';
config();

// Initialize Firebase Admin first
import './firebase';

// Then import the flows that depend on it
import '@/ai/flows/personalized-activity-recommendations.ts';
import '@/ai/flows/ai-assisted-room-upgrade-suggestions.ts';
import '@/ai/flows/create-user-flow.ts';
