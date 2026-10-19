import fs from 'fs/promises';
import path from 'path';

export interface SavedItem {
  id: string;
  type: 'reply' | 'date_plan' | 'counseling' | 'topic';
  title: string;
  summary: string;
  content: any;
  createdAt: string;
}

export interface DatingNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  partnerLikes?: string;
  partnerDislikes?: string;
  updatedAt: string;
}

export interface ChatHistoryItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  personaId?: string;
}

export interface AppDatabase {
  checklist: Record<string, boolean>;
  preferences: {
    selectedAnswers?: Record<string, number>;
    updatedAt?: string;
  };
  chatHistory: ChatHistoryItem[];
  savedFavorites: SavedItem[];
  datingNotes: DatingNote[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_DB: AppDatabase = {
  checklist: {},
  preferences: {},
  chatHistory: [],
  savedFavorites: [],
  datingNotes: [
    {
      id: 'default-note-1',
      title: '상대방 취향 & 사소한 기억 메모',
      content: '좋아하는 음식, 카페 취향, 사소하게 나눴던 말들을 잊지 않도록 여기에 메모해보세요.',
      tags: ['취향메모', '첫인상'],
      partnerLikes: '달달한 디저트, 강아지, 조용한 카페',
      partnerDislikes: '너무 시끄러운 술집, 매운 음식',
      updatedAt: new Date().toISOString(),
    },
  ],
};

let cachedDb: AppDatabase | null = null;

export async function getDb(): Promise<AppDatabase> {
  if (cachedDb) return cachedDb;

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    cachedDb = JSON.parse(content) as AppDatabase;
  } catch {
    cachedDb = { ...INITIAL_DB };
    await saveDb(cachedDb);
  }

  return cachedDb;
}

export async function saveDb(db: AppDatabase): Promise<void> {
  cachedDb = db;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write database file:', error);
  }
}
