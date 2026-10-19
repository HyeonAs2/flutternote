import React, { useState } from 'react';
import {
  Compass,
  Shuffle,
  AlertTriangle,
  Sparkles,
  MessageCircle,
  Clock,
  Lightbulb,
  Copy,
  Check,
  Send,
  SlidersHorizontal,
  Bot,
  Flame,
  Search,
} from 'lucide-react';
import {
  CONVERSATION_CARDS,
  CONVERSATION_CATEGORIES,
  ConversationCard,
  ConversationCategory,
} from '../data/conversationCards';

interface GeneratedTopic {
  id: string;
  category: string;
  question: string;
  timingTip: string;
  whyItWorks: string;
  followUpTips: string[];
  cautionTip: string;
}

export const ConversationVault: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ConversationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [randomCard, setRandomCard] = useState<ConversationCard | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Generator State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPartnerInfo, setAiPartnerInfo] = useState('');
  const [aiPlaceVibe, setAiPlaceVibe] = useState('조용하고 아늑한 카페');
  const [aiCategory, setAiCategory] = useState('취미, 여행, 음식, 최근 관심사 골고루');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    topics: GeneratedTopic[];
    coachOneLiner: string;
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filtering cards
  const filteredCards = CONVERSATION_CARDS.filter((card) => {
    const matchesCategory =
      selectedCategory === 'all' ? true : card.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.situationTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.whyItWorks.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePickRandom = () => {
    const validCards = CONVERSATION_CARDS.filter((c) => !c.isTaboo);
    const randomIndex = Math.floor(Math.random() * validCards.length);
    setRandomCard(validCards[randomIndex]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateAiTopics = async () => {
    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const res = await fetch('/api/generate-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: aiCategory,
          partnerInfo: aiPartnerInfo,
          placeVibe: aiPlaceVibe,
        }),
      });

      if (!res.ok) {
        throw new Error('AI 대화 주제 생성 중 문제가 발생했습니다.');
      }

      const data = await res.json();
      setGeneratedResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || '토픽을 생성하지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-2">
            <MessageCircle className="w-4 h-4" />
            <span>초기 데이트 대화 치트키 도서관</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            어색함 없는 첫 만남을 위한 상황별 대화 주제 가이드
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            취미, 여행, 음식, 영화·콘텐츠, 최근 관심사부터 식사 주문할 때, 길 걸을 때, 정적이 찾아왔을 때까지 바로 꺼내 쓸 수 있는 자연스러운 질문과 꼬리 질문(Follow-up)을 모았습니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setShowAiModal(true)}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl transition-colors flex items-center gap-2 text-sm shadow-xs cursor-pointer"
          >
            <Bot className="w-4 h-4 text-rose-400" />
            <span>AI 맞춤 토픽 생성</span>
          </button>
          <button
            onClick={handlePickRandom}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2 text-sm shadow-xs cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
            <span>랜덤 뽑기</span>
          </button>
        </div>
      </div>

      {/* AI Generator Modal / Expandable Panel */}
      {showAiModal && (
        <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-md transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                AI
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">상대방 맞춤형 대화 질문 생성기</h3>
                <p className="text-xs text-stone-500">
                  상대방에 대해 알고 있는 정보나 데이트 장소를 입력하면 Gemini가 맞춤형 질문 4개를 즉시 제작합니다.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAiModal(false)}
              className="text-stone-400 hover:text-stone-700 text-sm px-2 py-1"
            >
              닫기 ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                상대방에 대해 아는 정보 (선택)
              </label>
              <input
                type="text"
                value={aiPartnerInfo}
                onChange={(e) => setAiPartnerInfo(e.target.value)}
                placeholder="예: 강아지 키움, 마케터, 테니스 배움 등"
                className="w-full text-xs rounded-xl border border-stone-200 p-2.5 text-stone-800 focus:outline-none focus:border-rose-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                데이트 장소 / 분위기
              </label>
              <input
                type="text"
                value={aiPlaceVibe}
                onChange={(e) => setAiPlaceVibe(e.target.value)}
                placeholder="예: 성수동 브런치 카페, 조용한 일식당"
                className="w-full text-xs rounded-xl border border-stone-200 p-2.5 text-stone-800 focus:outline-none focus:border-rose-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                집중하고 싶은 주제
              </label>
              <select
                value={aiCategory}
                onChange={(e) => setAiCategory(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-200 p-2.5 text-stone-800 focus:outline-none focus:border-rose-400"
              >
                <option value="취미, 여행, 음식, 최근 관심사 골고루">골고루 균형 있게 (추천)</option>
                <option value="음식 & 맛집 & 취향 탐색">음식 & 맛집 탐색 위주</option>
                <option value="주말 취미 & 힐링 여가 생활">취미 & 라이프스타일 위주</option>
                <option value="최근 꽂힌 영화·OTT·유튜브">영화 & 콘텐츠 위주</option>
                <option value="여행지 추억 & 가고 싶은 곳">여행 & 버킷리스트 위주</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={handleGenerateAiTopics}
              disabled={isGeneratingAi}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-stone-300 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isGeneratingAi ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>AI 질문 제작 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>맞춤 질문 4가지 생성하기</span>
                </>
              )}
            </button>
          </div>

          {aiError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl mb-4">
              {aiError}
            </div>
          )}

          {/* Generated AI Topics Output */}
          {generatedResult && (
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl text-xs text-rose-800 font-medium">
                💡 <strong>코치 한줄 코멘트:</strong> {generatedResult.coachOneLiner}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedResult.topics.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-rose-600">
                        #{t.category}
                      </span>
                      <button
                        onClick={() => handleCopy(`ai-${idx}`, t.question)}
                        className="text-stone-400 hover:text-stone-700 p-1 text-xs flex items-center gap-1"
                      >
                        {copiedId === `ai-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>복사</span>
                      </button>
                    </div>

                    <p className="text-sm font-bold text-stone-900 leading-snug">
                      {t.question}
                    </p>

                    <div className="text-xs text-stone-600 space-y-1">
                      <p className="text-[11px] text-stone-500">
                        📍 <strong>추천 타이밍:</strong> {t.timingTip}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        ✨ <strong>효과:</strong> {t.whyItWorks}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-stone-200/60 text-[11px] text-stone-600">
                      <strong>꼬리 질문 팁:</strong>
                      <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-stone-500">
                        {t.followUpTips.map((tip, tipIdx) => (
                          <li key={tipIdx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Random Card Spotlight (if triggered) */}
      {randomCard && (
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-6 shadow-xs relative">
          <button
            onClick={() => setRandomCard(null)}
            className="absolute top-4 right-4 text-xs text-rose-500 hover:text-rose-700 font-medium"
          >
            닫기 ✕
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-rose-600 tracking-wide">
              🎲 오늘의 추천 질문 치트키
            </span>
            <span className="text-[11px] bg-white text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
              {randomCard.situationTag}
            </span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-3">
            {randomCard.question}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-white/80 p-3 rounded-xl border border-rose-100">
              <strong className="text-rose-700 block mb-1">언제 던지면 좋을까?</strong>
              <p className="text-stone-700">{randomCard.contextTip}</p>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-rose-100">
              <strong className="text-rose-700 block mb-1">상대방 반응 후 꼬리 질문 예시:</strong>
              <p className="text-stone-700">{randomCard.followUpExample}</p>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CONVERSATION_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상황 또는 키워드 검색..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white placeholder-stone-400 focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCards.map((card) => {
          const isTaboo = card.isTaboo;
          return (
            <div
              key={card.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between shadow-xs transition-all relative group ${
                isTaboo
                  ? 'bg-red-50/40 border-red-200 hover:border-red-300'
                  : 'bg-white border-stone-200 hover:border-rose-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Situation Tag & Copy Action */}
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      isTaboo
                        ? 'bg-red-100 text-red-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {card.categoryLabel}
                  </span>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-stone-400 font-medium">
                      {card.situationTag}
                    </span>
                    {!isTaboo && (
                      <button
                        onClick={() => handleCopy(card.id, card.question)}
                        title="질문 문장 복사"
                        className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
                      >
                        {copiedId === card.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Spoken Question Text */}
                <h3 className="font-bold text-stone-900 text-base leading-snug mb-3">
                  {card.question}
                </h3>

                {/* Context & Why It Works */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-stone-500 block font-medium mb-0.5">
                      {isTaboo ? '⚠️ 피해야 하는 상황' : '📍 추천 타이밍'}
                    </span>
                    <p className="text-stone-700 leading-relaxed">{card.contextTip}</p>
                  </div>

                  <div>
                    <span className="text-stone-500 block font-medium mb-0.5">
                      {isTaboo ? '심리적 악영향' : '💡 왜 효과적일까?'}
                    </span>
                    <p className="text-stone-700 leading-relaxed">{card.whyItWorks}</p>
                  </div>
                </div>
              </div>

              {/* Follow-up / Danger Point Section */}
              <div
                className={`mt-4 pt-3 border-t text-xs rounded-xl p-2.5 space-y-1.5 ${
                  isTaboo
                    ? 'border-red-100 bg-red-100/50 text-red-900'
                    : 'border-stone-100 bg-stone-50 text-stone-800'
                }`}
              >
                <div>
                  <strong className="text-[11px] block font-semibold mb-0.5">
                    {isTaboo ? '대신 이렇게 물어보세요:' : '💬 꼬리 질문(Follow-up) 예시:'}
                  </strong>
                  <p className="leading-relaxed text-stone-700">{card.followUpExample}</p>
                </div>

                {card.dangerPoint && !isTaboo && (
                  <div className="text-[11px] text-amber-800 pt-1 border-t border-stone-200/50">
                    <strong>주의:</strong> {card.dangerPoint}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCards.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
          <p className="text-sm font-medium">검색 결과가 없습니다.</p>
          <p className="text-xs text-stone-400 mt-1">다른 키워드로 검색하거나 카테고리를 변경해보세요.</p>
        </div>
      )}
    </div>
  );
};
