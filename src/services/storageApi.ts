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

export interface AppUserData {
  checklist: Record<string, boolean>;
  preferences: {
    selectedAnswers?: Record<string, number>;
    updatedAt?: string;
  };
  chatHistory: Array<{
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: string;
    personaId?: string;
  }>;
  savedFavorites: SavedItem[];
  datingNotes: DatingNote[];
}

export async function fetchUserData(): Promise<AppUserData> {
  const res = await fetch('/api/user-data');
  if (!res.ok) throw new Error('서버 데이터를 불러오지 못했습니다.');
  return res.json();
}

export async function saveChecklistToServer(checklist: Record<string, boolean>) {
  const res = await fetch('/api/user-data/checklist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checklist }),
  });
  if (!res.ok) throw new Error('체크리스트 서버 저장에 실패했습니다.');
  return res.json();
}

export async function savePreferencesToServer(preferences: {
  selectedAnswers?: Record<string, number>;
}) {
  const res = await fetch('/api/user-data/preferences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preferences }),
  });
  if (!res.ok) throw new Error('성향 서버 저장에 실패했습니다.');
  return res.json();
}

export async function saveChatHistoryToServer(chatHistory: any[]) {
  const res = await fetch('/api/user-data/chat-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatHistory }),
  });
  if (!res.ok) throw new Error('대화 기록 서버 저장에 실패했습니다.');
  return res.json();
}

export async function clearChatHistoryOnServer() {
  const res = await fetch('/api/user-data/chat-history', {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('대화 기록 초기화에 실패했습니다.');
  return res.json();
}

export async function saveFavoriteToServer(item: Omit<SavedItem, 'id' | 'createdAt'> & { id?: string }) {
  const res = await fetch('/api/user-data/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item }),
  });
  if (!res.ok) throw new Error('보관함 저장에 실패했습니다.');
  return res.json();
}

export async function removeFavoriteFromServer(id: string) {
  const res = await fetch(`/api/user-data/favorites/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('보관함 삭제에 실패했습니다.');
  return res.json();
}

export async function saveNoteToServer(note: DatingNote) {
  const res = await fetch('/api/user-data/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) throw new Error('노트 서버 저장에 실패했습니다.');
  return res.json();
}

export async function deleteNoteFromServer(id: string) {
  const res = await fetch(`/api/user-data/notes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('노트 삭제에 실패했습니다.');
  return res.json();
}
