import React, { useState } from 'react';
import {
  HeartHandshake,
  Sparkles,
  Compass,
  Copy,
  Check,
  HelpCircle,
  ShieldCheck,
  Scale,
  MessageCircle,
  Lightbulb,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import {
  PREFERENCE_QUESTIONS,
  PRESET_DILEMMAS,
  PreferenceQuestion,
  PresetDilemma,
} from '../data/preferences';

interface HarmonizerResult {
  summaryTitle: string;
  myNeedInsight: string;
  partnerNeedInsight: string;
  mindsetShift: string;
  harmonizationRules: {
    step: number;
    ruleTitle: string;
    explanation: string;
  }[];
  conversationScript: string;
  checkQuestions: string[];
}

export const PreferenceExplorer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'survey' | 'harmonize'>('harmonize');

  // Self Survey State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({
    'q-contact': 0,
    'q-expression': 0,
    'q-conflict': 0,
    'q-pace': 0,
  });

  // Harmonizer Input State
  const [userTendency, setUserTendency] = useState('나는 자주 연락하고 일상을 나누는 게 중요한 편');
  const [partnerTendency, setPartnerTendency] = useState('상대방은 혼자 푹 쉬며 에너지를 채우는 시간이 필요함');
  const [conflictScenario, setConflictScenario] = useState('“나는 자주 연락하는 게 중요한데, 상대방은 혼자 있는 시간이 필요하대.”');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HarmonizerResult | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApplyPreset = (dilemma: PresetDilemma) => {
    setUserTendency(dilemma.userNeed);
    setPartnerTendency(dilemma.partnerNeed);
    setConflictScenario(dilemma.scenario);
    setResult(null);
  };

  const handleRunHarmonizer = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/preference-harmonizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userTendency,
          partnerTendency,
          conflictScenario,
        }),
      });

      if (!res.ok) {
        throw new Error('조율 솔루션을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-2">
            <Scale className="w-4 h-4" />
            <span>나의 연애 성향 탐색 & 조율 솔루션</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            성격을 재단하지 않고, 서로 다른 선호를 조율하는 법
          </h2>
          <p className="text-sm text-stone-600 mt-1 leading-relaxed">
            “나는 자주 연락하는 게 중요한데, 상대방은 혼자 있는 시간이 필요하대.”<br className="hidden sm:inline" />
            연애에 정답인 성격이나 100점짜리 궁합은 없습니다. 나와 상대방의 서로 다른 선호와 심리를 깊이 이해하고, 다정하게 마음을 좁혀가는 실전 소통법을 제안합니다.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-stone-100">
          <button
            onClick={() => setActiveSubTab('harmonize')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'harmonize'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>선호 차이 조율 솔루션 (상황 분석)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('survey')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'survey'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>나의 4대 연애 가치관 탐색기</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Preference Harmonizer (Core Feature) */}
      {activeSubTab === 'harmonize' && (
        <div className="space-y-6">
          {/* Preset Dilemmas */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="text-xs font-bold text-stone-500 mb-2.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>연애 초보자들이 가장 자주 부딪히는 차이 (클릭 시 자동 세팅):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {PRESET_DILEMMAS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleApplyPreset(item)}
                  className="text-left p-3 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all text-xs group cursor-pointer"
                >
                  <div className="font-bold text-stone-900 mb-1 group-hover:text-rose-700">
                    {item.title}
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {item.scenario}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form Column */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-base">서로 다른 선호 입력하기</h3>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  나의 선호 / 가치관 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={userTendency}
                  onChange={(e) => setUserTendency(e.target.value)}
                  placeholder="예: 나는 자주 연락하고 일상을 나누는 게 중요한 편"
                  rows={2}
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  상대방의 다른 선호 / 태도 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={partnerTendency}
                  onChange={(e) => setPartnerTendency(e.target.value)}
                  placeholder="예: 상대방은 혼자 있는 동굴 시간이 필요하다고 함"
                  rows={2}
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  구체적인 상황이나 서운했던 순간 (선택)
                </label>
                <textarea
                  value={conflictScenario}
                  onChange={(e) => setConflictScenario(e.target.value)}
                  placeholder="예: 주말에 연락 텀이 4시간 넘어가면 불안한데, 상대는 게임하거나 쉬고 싶대요."
                  rows={2}
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-rose-400"
                />
              </div>

              <button
                onClick={handleRunHarmonizer}
                disabled={isLoading || !userTendency.trim()}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-xs shadow-xs cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>마음을 다치지 않는 조율 솔루션 설계 중...</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake className="w-4 h-4" />
                    <span>다름을 좁히는 조율 솔루션 받기</span>
                  </>
                )}
              </button>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Output Column */}
            <div className="lg:col-span-7">
              {result ? (
                <div className="space-y-4">
                  {/* Summary & Mindset Shift Banner */}
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                    <span className="text-xs font-bold text-rose-600">조율 인사이트</span>
                    <h4 className="font-bold text-stone-900 text-base mt-1">
                      {result.summaryTitle}
                    </h4>
                    <div className="mt-2.5 p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-900 leading-relaxed font-medium">
                      ✨ <strong>인식 전환:</strong> {result.mindsetShift}
                    </div>
                  </div>

                  {/* Dual Empathy: My Need vs Partner's Perspective */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 mb-2">
                        <UserCheck className="w-4 h-4 text-rose-500" />
                        <span>나의 선호 뒤에 숨은 건강한 욕구</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {result.myNeedInsight}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 mb-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-500" />
                        <span>상대방 관점의 진짜 심리</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {result.partnerNeedInsight}
                      </p>
                    </div>
                  </div>

                  {/* 3 Harmonization Rules */}
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                    <h5 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <Scale className="w-4 h-4 text-rose-600" />
                      <span>둘 사이의 실천 가능한 3단계 절충 룰</span>
                    </h5>

                    <div className="space-y-2.5">
                      {result.harmonizationRules.map((rule) => (
                        <div
                          key={rule.step}
                          className="p-3 rounded-xl bg-stone-50 border border-stone-200/60"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 font-bold text-[11px] flex items-center justify-center">
                              {rule.step}
                            </span>
                            <span className="font-bold text-stone-900 text-xs">
                              {rule.ruleTitle}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 pl-7 leading-relaxed">
                            {rule.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Non-violent Communication Script */}
                  <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>비난 없이 마음을 건네는 대화 스크립트 (나 전달법)</span>
                      </span>
                      <button
                        onClick={() => handleCopyScript(result.conversationScript)}
                        className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {copiedScript ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">복사됨!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>대화문 복사</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3.5 bg-stone-800/80 rounded-xl text-xs text-stone-200 leading-relaxed my-2 font-medium border border-stone-700">
                      “{result.conversationScript}”
                    </div>

                    {/* Check Questions */}
                    <div className="mt-3 pt-3 border-t border-stone-800 text-[11px] text-stone-400">
                      <strong>함께 웃으며 상의해볼 수 있는 질문:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-stone-300">
                        {result.checkQuestions.map((q, qIdx) => (
                          <li key={qIdx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[380px] bg-white rounded-2xl border border-stone-200 p-8 shadow-xs flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                    <Scale className="w-7 h-7" />
                  </div>
                  <h4 className="font-semibold text-stone-800 text-base mb-1">
                    서로 다른 선호를 입력하고 조율법을 확인하세요
                  </h4>
                  <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
                    상대방을 비난하거나 억지로 참지 않고, 두 사람의 성향을 모두 지키며 건강하게 사랑할 수 있는 현실적 소통 스크립트를 제공합니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: 4-Dimension Self Exploration */}
      {activeSubTab === 'survey' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <h3 className="font-bold text-stone-900 text-base mb-1">
              나의 4대 연애 가치관 자가 진단
            </h3>
            <p className="text-xs text-stone-500">
              어느 쪽이 더 성숙하거나 우월한 것이 아닙니다. 솔직하게 선택해보면 내가 관계에서 무엇을 필요로 하는 사람인지 명확해집니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PREFERENCE_QUESTIONS.map((q) => {
              const currentChoice = selectedAnswers[q.id] ?? 0;
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      {q.categoryLabel}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm leading-snug">
                    {q.title}
                  </h4>
                  <p className="text-[11px] text-stone-500">{q.description}</p>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = currentChoice === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [q.id]: optIdx,
                            }))
                          }
                          className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'border-rose-300 bg-rose-50/70 shadow-xs'
                              : 'border-stone-200 bg-white hover:bg-stone-50'
                          }`}
                        >
                          <div className="font-bold text-stone-900 mb-0.5">
                            {opt.label}
                          </div>
                          <p className="text-[11px] text-stone-600 leading-relaxed">
                            {opt.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Insight into user's choice */}
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60 text-[11px] text-stone-600">
                    <strong>💡 나의 핵심 가치:</strong>{' '}
                    {q.options[currentChoice]?.myCoreValue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
