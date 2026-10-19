import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Database,
  Trash2,
  Copy,
  Check,
  Plus,
  Heart,
  Calendar,
  Sparkles,
  MessageSquare,
  MapPin,
  HelpCircle,
  FileText,
  RotateCw,
} from 'lucide-react';
import {
  fetchUserData,
  removeFavoriteFromServer,
  saveNoteToServer,
  deleteNoteFromServer,
  SavedItem,
  DatingNote,
  AppUserData,
} from '../services/storageApi';

export const StorageVault: React.FC = () => {
  const [userData, setUserData] = useState<AppUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Note Modal / Inline Form
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [partnerLikes, setPartnerLikes] = useState('');
  const [partnerDislikes, setPartnerDislikes] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserData();
      setUserData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteFavorite = async (id: string) => {
    if (!window.confirm('이 항목을 보관함에서 삭제하시겠습니까?')) return;
    try {
      const res = await removeFavoriteFromServer(id);
      if (userData) {
        setUserData({ ...userData, savedFavorites: res.savedFavorites });
      }
    } catch (e) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenNewNote = () => {
    setEditingNoteId(null);
    setNoteTitle('');
    setNoteContent('');
    setPartnerLikes('');
    setPartnerDislikes('');
    setIsEditingNote(true);
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      alert('노트 제목을 입력해주세요.');
      return;
    }
    setIsSavingNote(true);
    try {
      const noteToSave: DatingNote = {
        id: editingNoteId || `note-${Date.now()}`,
        title: noteTitle,
        content: noteContent,
        tags: ['비밀메모'],
        partnerLikes,
        partnerDislikes,
        updatedAt: new Date().toISOString(),
      };
      const res = await saveNoteToServer(noteToSave);
      if (userData) {
        setUserData({ ...userData, datingNotes: res.datingNotes });
      }
      setIsEditingNote(false);
    } catch (e) {
      alert('노트 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!window.confirm('이 노트를 삭제하시겠습니까?')) return;
    try {
      const res = await deleteNoteFromServer(id);
      if (userData) {
        setUserData({ ...userData, datingNotes: res.datingNotes });
      }
    } catch (e) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const filteredFavorites =
    userData?.savedFavorites.filter((item) => {
      if (filterType === 'all') return true;
      return item.type === filterType;
    }) || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-2">
            <Database className="w-4 h-4" />
            <span>백엔드 서버 영구 보관소 & 비밀 노트</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            내 보관함 & 상대방 취향 비밀 메모장
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
            새로고침을 하거나 다른 브라우저에서 접속해도 안전하게 보존됩니다. 내가 찜해둔 카톡 답장, 데이트 코스, 고민 처방전과 상대방의 사소한 취향 메모를 관리하세요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            title="서버 데이터 새로고침"
            className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>동기화</span>
          </button>
          <button
            onClick={handleOpenNewNote}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-colors flex items-center gap-1.5 text-xs shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>새 메모 작성</span>
          </button>
        </div>
      </div>

      {/* Sync Status Indicators */}
      {userData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[11px] text-stone-500 block">체크리스트 서버 백업</span>
            <div className="text-sm font-bold text-stone-900 mt-0.5">
              {Object.values(userData.checklist).filter(Boolean).length}개 항목 완료됨
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[11px] text-stone-500 block">AI 코칭 대화 보존</span>
            <div className="text-sm font-bold text-stone-900 mt-0.5">
              {userData.chatHistory.length}개 메시지 저장됨
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[11px] text-stone-500 block">찜한 솔루션 보관함</span>
            <div className="text-sm font-bold text-rose-600 mt-0.5">
              {userData.savedFavorites.length}개 저장됨
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[11px] text-stone-500 block">상대방 취향 메모</span>
            <div className="text-sm font-bold text-stone-900 mt-0.5">
              {userData.datingNotes.length}개 등록됨
            </div>
          </div>
        </div>
      )}

      {/* Note Editor Modal / Drawer */}
      {isEditingNote && (
        <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-md transition-all">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-600" />
              <span>상대방 취향 & 사소한 기억 비밀 메모</span>
            </h3>
            <button
              onClick={() => setIsEditingNote(false)}
              className="text-stone-400 hover:text-stone-700 text-xs"
            >
              닫기 ✕
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                메모 제목 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="예: OOO 씨 좋아하는 음식 & 대화 키워드"
                className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-800 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-emerald-700 mb-1">
                  좋아하는 것 (Likes)
                </label>
                <input
                  type="text"
                  value={partnerLikes}
                  onChange={(e) => setPartnerLikes(e.target.value)}
                  placeholder="예: 초콜릿 케이크, 조용한 재즈, 고양이"
                  className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="block font-semibold text-red-700 mb-1">
                  싫어하거나 피하는 것 (Dislikes)
                </label>
                <input
                  type="text"
                  value={partnerDislikes}
                  onChange={(e) => setPartnerDislikes(e.target.value)}
                  placeholder="예: 오이, 매운 음식, 시끄러운 술집"
                  className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                자세한 메모 내용
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="상대방이 흘리듯 말했던 가보고 싶은 곳, 최근 고민, 생일 등을 적어두면 다음 데이트 때 큰 감동을 줄 수 있습니다."
                rows={3}
                className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-800 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditingNote(false)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
              >
                취소
              </button>
              <button
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium"
              >
                {isSavingNote ? '서버에 저장 중...' : '백엔드 서버에 저장하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dating Notes Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-500" />
          <span>나만의 비밀 연애 메모장</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userData?.datingNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2.5 relative group"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-stone-900 text-sm">{note.title}</h4>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-stone-300 hover:text-red-500 p-1 transition-colors"
                  title="메모 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {(note.partnerLikes || note.partnerDislikes) && (
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {note.partnerLikes && (
                    <div>
                      <strong className="text-emerald-700 block mb-0.5">👍 좋아하는 것:</strong>
                      <p className="text-stone-700">{note.partnerLikes}</p>
                    </div>
                  )}
                  {note.partnerDislikes && (
                    <div>
                      <strong className="text-red-700 block mb-0.5">👎 싫어하는 것:</strong>
                      <p className="text-stone-700">{note.partnerDislikes}</p>
                    </div>
                  )}
                </div>
              )}

              {note.content && (
                <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              )}

              <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                수정일: {new Date(note.updatedAt).toLocaleDateString('ko-KR')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Favorites Section */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-rose-600" />
            <span>내가 찜한 솔루션 & 처방전 보관함</span>
          </h3>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterType === 'all'
                  ? 'bg-rose-600 border-rose-600 text-white font-medium'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              전체 ({userData?.savedFavorites.length || 0})
            </button>
            <button
              onClick={() => setFilterType('reply')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterType === 'reply'
                  ? 'bg-rose-600 border-rose-600 text-white font-medium'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              카톡 답장
            </button>
            <button
              onClick={() => setFilterType('date_plan')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterType === 'date_plan'
                  ? 'bg-rose-600 border-rose-600 text-white font-medium'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              데이트 코스
            </button>
            <button
              onClick={() => setFilterType('counseling')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterType === 'counseling'
                  ? 'bg-rose-600 border-rose-600 text-white font-medium'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              고민 처방
            </button>
          </div>
        </div>

        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFavorites.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    {item.type === 'reply'
                      ? '💌 카톡 답장'
                      : item.type === 'date_plan'
                      ? '🗺️ 데이트 코스'
                      : '💡 고민 처방'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.id, typeof item.content === 'string' ? item.content : JSON.stringify(item.content))}
                      className="p-1 text-stone-400 hover:text-stone-700"
                      title="내용 복사"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteFavorite(item.id)}
                      className="p-1 text-stone-300 hover:text-red-500"
                      title="보관함에서 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-stone-900 text-sm">{item.title}</h4>
                {item.summary && (
                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    {item.summary}
                  </p>
                )}

                <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-100 flex items-center justify-between">
                  <span>저장일: {new Date(item.createdAt).toLocaleDateString('ko-KR')}</span>
                  <span className="text-emerald-600 font-medium">서버 저장 완료 ✓</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center text-stone-400 text-xs">
            보관된 항목이 없습니다. 카톡 답장, 데이트 코스, 고민 상담 결과에서 '⭐ 서버에 보관' 버튼을 눌러보세요!
          </div>
        )}
      </div>
    </div>
  );
};
