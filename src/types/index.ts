export type CoachPersonaId = 'mentor' | 'realist' | 'messaging' | 'roleplay_partner';

export interface CoachPersona {
  id: CoachPersonaId;
  name: string;
  roleTitle: string;
  avatarBg: string;
  avatarEmoji: string;
  description: string;
  greeting: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  personaId?: CoachPersonaId;
}

export interface ReplyAnalysis {
  intent: string;
  greenFlagScore: number;
  signalSummary: string;
}

export interface ReplyOption {
  toneName: string;
  message: string;
  whyItWorks: string;
  emojiTip: string;
}

export interface ReplyDoctorResult {
  analysis: ReplyAnalysis;
  timingRecommendation: string;
  replyOptions: ReplyOption[];
  cautionTip: string;
}

export interface DateStep {
  step: number;
  time: string;
  placeType: string;
  activity: string;
  conversationStarters: string[];
  beginnerMannerTip: string;
}

export interface DatePlanResult {
  title: string;
  concept: string;
  schedule: DateStep[];
  emergencySilenceBreaker: string;
  afterMessageSample: string;
}
