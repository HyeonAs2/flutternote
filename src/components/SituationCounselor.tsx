import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  HeartHandshake,
  ShieldAlert,
  Copy,
  Check,
  Compass,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageSquare,
  ArrowRight,
  Bookmark,
} from 'lucide-react';
import { saveFavoriteToServer } from '../services/storageApi';

interface PossibleReason {
  title: string;
  explanation: string;
  cautionIfAssumed: string;
}

interface ActionChoice {
  choiceName: string;
  recommendationWhen: string;
  howToAct: string;
  samplePhrase: string;
}

interface CounselorResult {
  counselingTitle: string;
  emotionValidation: string;
  possibleReasons: PossibleReason[];
  actionChoices: ActionChoice[];
  directDialogueScript: string;
  coachOneLiner: string;
}

const PRESET_SITUATIONS = [
  {
    title: '연락 텀 감소 의문',
    situation: '상대방이 전보다 연락을 덜 하는 것 같아. 마음이 변한 걸까?',
    stage: '썸 타는 중 (1~2달 차)',
    feeling: '불안함과 서운함, 버림받을까 봐 드는 두려움',
  },
  {
    title: '만날 땐 다정, 톡은 뜸함',
    situation: '데이트할 때는 엄청 웃고 다정한데, 헤어지고 나면 카톡 답장이 2~3시간씩 걸려요.',
    stage: '소개팅 후 2~3회 만남 진행 중',
    feeling: '혼란스러움과 헷갈림, 상대 속마음을 모르겠음',
  },
  {
    title: '약속 미루기 & 바쁘다는 답',
    situation: '이번 주말에 보자고 했더니 “요즘 일이 바빠서 일정 보고 알려줄게”라고만 해요.',
    stage: '썸 단계에서 다음 만남 조율 중',
    feeling: '거절당한 것 같은 민망함과 자존감 하락',
  },
  {
    title: '나만 선톡하는 일방통행',
    situation: '대화는 잘 이어지는데, 항상 제가 먼저 선톡을 보내요. 상대방은 먼저 연락을 안 해요.',
    stage: '매일 연락하는 썸',
    feeling: '나만 좋아하는 것 같아 지치고 자존심 상함',
  },
];

export const SituationCounselor: React.FC = () => {
  const [situationText, setSituationText] = useState('상대방이 전보다 연락을 덜 하는 것 같아. 마음이 변한 걸까?');
  const [currentStage, setCurrentStage] = useState('썸 타는 중 (1~2달 차)');
  const [myFeeling, setMyFeeling] = useState('불안함, 서운함, 혼자만의 뇌피셜로 복잡함');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CounselorResult | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSavedToVault, setIsSavedToVault] = useState(false);

  const handleSaveCounseling = async () => {
    if (!result) return;
    try {
      await saveFavoriteToServer({
        type: 'counseling',
        title: `고민 상담: "${situationText.slice(0, 20)}..."`,
        summary: result.counselingTitle,
        content: result,
      });
      setIsSavedToVault(true);
      setTimeout(() => setIsSavedToVault(false), 2500);
    } catch (e) {
      alert('처방 저장에 실패했습니다.');
    }
  };

  const handleApplyPreset = (preset: (typeof PRESET_SITUATIONS)[0]) => {
    setSituationText(preset.situation);
    setCurrentStage(preset.stage);
    setMyFeeling(preset.feeling);
    setResult(null);
  };

  const handleConsult = async () => {
    if (!situationText.trim()) {
      alert('고민 상황을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/situation-counselor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situationText,
          currentStage,
          myFeeling,
        }),
      });

      if (!res.ok) {
        throw new Error('상담 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '상담 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>상황별 연애 고민 상담소</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            상대방의 마음을 단정하지 않고, 감정과 선택지를 정리하기
          </h2>
          <p className="text-sm text-stone-600 mt-1 leading-relaxed">
            “상대방이 전보다 연락을 덜 하는 것 같아. 마음이 변한 걸까?”<br className="hidden sm:inline" />
            혼자 불안해하며 섣부른 결론을 내리기 전에, 가능한 여러 이유를 객관적으로 살펴보고 가장 안전하고 성숙하게 대화하는 선택지를 찾아보세요.
          </p>
        </div>

        {/* 1-Click Common Crisis Presets */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <div className="text-xs font-bold text-stone-500 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>자주 겪는 대표 고민 상황 (클릭 시 자동 세팅):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PRESET_SITUATIONS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className="text-left p-3 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all text-xs group cursor-pointer"
              >
                <div className="font-bold text-stone-900 mb-1 group-hover:text-rose-700">
                  {preset.title}
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                  {preset.situation}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-base">내 고민 상황 적기</h3>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              지금 겪고 있는 상황이나 의문 <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={situationText}
              onChange={(e) => setSituationText(e.target.value)}
              placeholder="예: 상대방이 전보다 연락을 덜 하는 것 같아. 마음이 변한 걸까?"
              rows={3}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              현재 관계 단계
            </label>
            <select
              value={currentStage}
              onChange={(e) => setCurrentStage(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-800 focus:outline-none focus:border-rose-400"
            >
              <option value="소개팅 전 카톡 연락 중">소개팅 전 첫 연락 중</option>
              <option value="첫 만남 후 애프터 조율 중">첫 데이트 후 다음 약속 조율 중</option>
              <option value="썸 타는 중 (1~2달 차)">썸 타는 중 (1~2달 차)</option>
              <option value="연애 초반 (1~3개월 차)">연애 초반 (1~3개월 차)</option>
              <option value="안정기 연애 중">안정기 연애 중</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              지금 내가 주로 느끼는 감정
            </label>
            <input
              type="text"
              value={myFeeling}
              onChange={(e) => setMyFeeling(e.target.value)}
              placeholder="예: 불안함, 서운함, 혼자만 진심인 것 같은 두려움"
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          <button
            onClick={handleConsult}
            disabled={isLoading || !situationText.trim()}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-xs shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>맥락 분석 및 선택지 정리 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>감정 정리 & 객관적 선택지 찾기</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-4">
              {/* Emotion Validation Banner */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                    <HeartHandshake className="w-4 h-4" />
                    <span>마음 다독이기 & 감정 수용</span>
                  </div>
                  <button
                    onClick={handleSaveCounseling}
                    className="flex items-center gap-1 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    title="백엔드 서버 보관함에 저장"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-rose-600" />
                    <span>{isSavedToVault ? '서버 저장 완료 ✓' : '서버에 보관'}</span>
                  </button>
                </div>
                <h4 className="font-bold text-stone-900 text-base mb-2">
                  {result.counselingTitle}
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed bg-rose-50/60 border border-rose-100 p-3 rounded-xl">
                  {result.emotionValidation}
                </p>
                <div className="mt-3 text-xs text-stone-500 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>💡 <strong>코치 가이드:</strong> {result.coachOneLiner}</span>
                </div>
              </div>

              {/* 3 Plausible Reasons (Not Assuming) */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-indigo-500" />
                    <span>상대방 마음을 단정하지 않고 본 가능한 3가지 이유</span>
                  </h5>
                  <span className="text-[11px] text-stone-400">섣부른 결론 주의</span>
                </div>

                <div className="space-y-2.5">
                  {result.possibleReasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs space-y-1.5"
                    >
                      <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span>{reason.title}</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed pl-5.5">
                        {reason.explanation}
                      </p>
                      <div className="pl-5.5 text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-100">
                        <strong>⚠️ 단정했을 때 위험:</strong> {reason.cautionIfAssumed}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Paths / 3 Choices */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <h5 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-rose-600" />
                  <span>내가 선택할 수 있는 3가지 현명한 행동 경로</span>
                </h5>

                <div className="grid grid-cols-1 gap-2.5">
                  {result.actionChoices.map((choice, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-stone-200 hover:border-rose-200 transition-colors text-xs space-y-1 bg-stone-50/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">
                          {choice.choiceName}
                        </span>
                        <span className="text-[11px] text-rose-600 font-medium">
                          {choice.recommendationWhen}
                        </span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {choice.howToAct}
                      </p>
                      <div className="mt-1.5 p-2 bg-white rounded-lg border border-stone-200/60 text-[11px] text-stone-800 font-medium">
                        💬 <strong>실천 예시:</strong> “{choice.samplePhrase}”
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Dialogue Script (Non-violent check-in) */}
              <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>혼자 앓지 않고 직접 확인하는 다정한 대화 스크립트</span>
                  </span>
                  <button
                    onClick={() => handleCopy(result.directDialogueScript)}
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
                        <span>대사 복사</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 bg-stone-800/80 rounded-xl text-xs text-stone-200 leading-relaxed font-medium border border-stone-700">
                  “{result.directDialogueScript}”
                </div>
                <p className="text-[11px] text-stone-400 mt-2">
                  💡 상대를 몰아세우거나 죄책감을 주지 않고, 나의 솔직한 감정을 전하면서 상대방의 상황을 배려하는 황금 소통법입니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-white rounded-2xl border border-stone-200 p-8 shadow-xs flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                <HelpCircle className="w-7 h-7" />
              </div>
              <h4 className="font-semibold text-stone-800 text-base mb-1">
                불안한 연애 고민을 편하게 적어보세요
              </h4>
              <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
                “마음이 식은 걸까?”, “내가 뭘 잘못했나?” 혼자 속앓이하지 마세요. 가능한 여러 원인을 짚어보고, 직접 대화할 수 있는 안전한 방법을 알려드립니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
