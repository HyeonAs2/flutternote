import React from 'react';
import { MessageSquareHeart, Sparkles, Send, MapPin, Compass, CheckCircle2, Scale, HelpCircle, Bookmark } from 'lucide-react';

export type NavTab = 'chat' | 'reply' | 'planner' | 'vault' | 'preferences' | 'counselor' | 'storage' | 'roadmap';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'chat' as NavTab,
      label: '1:1 AI 코칭룸',
      sub: '멀티턴 실시간 상담',
      icon: MessageSquareHeart,
    },
    {
      id: 'reply' as NavTab,
      label: '카톡 답장 처방소',
      sub: '속마음 분석 & 3단 멘트',
      icon: Send,
    },
    {
      id: 'planner' as NavTab,
      label: '첫 데이트 플래너',
      sub: '정적 없는 3단계 코스',
      icon: MapPin,
    },
    {
      id: 'vault' as NavTab,
      label: '만능 대화 카드',
      sub: '침묵 탈출 & 상황별 토픽',
      icon: Compass,
    },
    {
      id: 'preferences' as NavTab,
      label: '성향 탐색 & 조율',
      sub: '다름을 이해하는 소통법',
      icon: Scale,
    },
    {
      id: 'counselor' as NavTab,
      label: '상황별 고민 상담소',
      sub: '마음 추측 대신 선택지 찾기',
      icon: HelpCircle,
    },
    {
      id: 'storage' as NavTab,
      label: '내 보관함 & 비밀노트',
      sub: '서버 데이터 영구 보관',
      icon: Bookmark,
    },
    {
      id: 'roadmap' as NavTab,
      label: '실전 체크리스트',
      sub: 'D-3부터 애프터까지',
      icon: CheckCircle2,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('chat')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-sm shadow-rose-200">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-lg tracking-tight">설렘노트</span>
                <span className="text-xs text-rose-600 font-medium">Beginner's Coach</span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                연애가 처음인 분들을 위한 1:1 맞춤형 AI 연애 가이드
              </p>
            </div>
          </div>

          {/* Secondary reassurance note */}
          <div className="hidden md:flex items-center gap-2 text-xs text-stone-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Gemini 3.8 AI 코치 실시간 대기 중</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none border-t border-stone-100 sm:border-0 pt-2 sm:pt-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
