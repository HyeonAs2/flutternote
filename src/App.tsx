import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { ChatCoaching } from './components/ChatCoaching';
import { ReplyDoctor } from './components/ReplyDoctor';
import { DatePlanner } from './components/DatePlanner';
import { ConversationVault } from './components/ConversationVault';
import { PreferenceExplorer } from './components/PreferenceExplorer';
import { SituationCounselor } from './components/SituationCounselor';
import { StorageVault } from './components/StorageVault';
import { DatingRoadmap } from './components/DatingRoadmap';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('chat');

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'chat' && <ChatCoaching />}
        {activeTab === 'reply' && <ReplyDoctor />}
        {activeTab === 'planner' && <DatePlanner />}
        {activeTab === 'vault' && <ConversationVault />}
        {activeTab === 'preferences' && <PreferenceExplorer />}
        {activeTab === 'counselor' && <SituationCounselor />}
        {activeTab === 'storage' && <StorageVault />}
        {activeTab === 'roadmap' && <DatingRoadmap />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-stone-700">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>설렘노트 · 연애 초보자를 위한 1:1 맞춤 AI 연애 코칭</span>
          </div>
          <div className="text-stone-400">
            당신의 첫 걸음을 진심으로 응원합니다. 모든 대화는 안전하게 보호됩니다.
          </div>
        </div>
      </footer>
    </div>
  );
}
