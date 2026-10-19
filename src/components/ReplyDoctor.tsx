import React, { useState } from 'react';
import { Send, Copy, Check, Sparkles, AlertCircle, Clock, ShieldCheck, Heart, MessageSquare, Bookmark } from 'lucide-react';
import { ReplyDoctorResult } from '../types';
import { saveFavoriteToServer } from '../services/storageApi';

const SAMPLE_SCENARIOS = [
  {
    title: '데이트 귀가 후 상대방 카톡',
    message: '오늘 정말 즐거웠어요! 집 조심히 들어가세요~ ㅎㅎ',
    stage: '소개팅/첫 데이트 직후',
    context: '첫 만남 후 각자 지하철 타고 귀가하는 중',
    goal: '오늘 만남에 대한 감사를 전하고 다음 애프터 여지 남기기',
  },
  {
    title: '상대방의 늦은 답장 사과',
    message: '앗 늦게 봐서 너무 미안해요!! 오늘 회사에 갑자기 이슈가 터져서 정신이 하나도 없었네요 ㅠㅠ',
    stage: '썸 단계에서 매일 연락 중',
    context: '6시간 만에 밤 9시 넘어 온 답장',
    goal: '상대방 부담 덜어주면서 자연스럽게 위로하고 대화 이어가기',
  },
  {
    title: '주말 일상 질문',
    message: 'OOO 씨는 이번 주말에 보통 뭐 하고 보내실 예정이에요?',
    stage: '호감 있는 상태로 연락 5일차',
    context: '목요일 저녁 일상적인 대화 중',
    goal: '자연스럽게 주말 약속(데이트)으로 빌드업하기',
  },
  {
    title: '음식/맛집 사진에 대한 반응',
    message: '와 거기 분위기 진짜 좋아 보이네요! 디저트도 완전 제 스타일이에요 ㅋㅋ',
    stage: '소개팅 전 카톡 대화 중',
    context: '주말에 다녀온 카페 사진을 공유했을 때',
    goal: '“그럼 우리 첫 만남 때 거기 가요!”로 자연스럽게 약속 확정하기',
  },
];

export const ReplyDoctor: React.FC = () => {
  const [receivedMessage, setReceivedMessage] = useState('');
  const [relationshipStage, setRelationshipStage] = useState('소개팅 후 연락 중');
  const [context, setContext] = useState('');
  const [userGoal, setUserGoal] = useState('자연스럽게 대화 이어가며 호감 전하기');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReplyDoctorResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSavedToVault, setIsSavedToVault] = useState(false);

  const handleSaveToVault = async () => {
    if (!result) return;
    try {
      await saveFavoriteToServer({
        type: 'reply',
        title: `카톡 답장: "${receivedMessage.slice(0, 20)}..."`,
        summary: `호감도 ${result.analysis.greenFlagScore}점 · ${result.analysis.signalSummary}`,
        content: result,
      });
      setIsSavedToVault(true);
      setTimeout(() => setIsSavedToVault(false), 2500);
    } catch (e) {
      alert('보관함 저장에 실패했습니다.');
    }
  };

  const handleApplySample = (sample: (typeof SAMPLE_SCENARIOS)[0]) => {
    setReceivedMessage(sample.message);
    setRelationshipStage(sample.stage);
    setContext(sample.context);
    setUserGoal(sample.goal);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!receivedMessage.trim()) {
      alert('상대방에게 받은 메시지를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/reply-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receivedMessage,
          relationshipStage,
          context,
          userGoal,
        }),
      });

      if (!res.ok) {
        throw new Error('처방을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '답장 분석 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>실전 카톡 답장 연구소</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            상대방의 속마음 분석 & 3단 맞춤 답장 처방
          </h2>
          <p className="text-sm text-stone-600 mt-1 leading-relaxed">
            “이 카톡에 뭐라고 답장해야 부담스럽지 않을까?” 수없이 지웠다 썼다 하셨나요? 상대방의 숨은 뉘앙스를 읽어내고 최적의 답장을 바로 복사해 사용하세요.
          </p>
        </div>

        {/* 1-Click Test Scenarios */}
        <div className="mt-5 pt-5 border-t border-stone-100">
          <div className="text-xs font-semibold text-stone-500 mb-2.5">
            자주 겪는 상황 예시 (클릭 시 자동 입력):
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SCENARIOS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleApplySample(s)}
                className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-rose-50 hover:border-rose-200 text-stone-700 transition-colors"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h3 className="font-semibold text-stone-900 text-base">상황 입력하기</h3>

          {/* Received Message */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              상대방이 보낸 카톡/메시지 <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={receivedMessage}
              onChange={(e) => setReceivedMessage(e.target.value)}
              placeholder="예: 오늘 너무 재밌었어요! 담에 또 봐요 ㅎㅎ"
              rows={3}
              className="w-full rounded-xl border border-stone-200 p-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
            />
          </div>

          {/* Relationship Stage */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              현재 관계 단계
            </label>
            <select
              value={relationshipStage}
              onChange={(e) => setRelationshipStage(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-2.5 text-sm text-stone-800 focus:outline-none focus:border-rose-400"
            >
              <option value="소개팅 전 연락 중">소개팅 전 첫 카톡 연락 중</option>
              <option value="첫 만남(소개팅) 직후">첫 만남(소개팅) 직후</option>
              <option value="썸 타는 중 (1~2회 만남)">썸 타는 중 (1~2회 만남)</option>
              <option value="고백 직전의 진지한 썸">고백 직전의 진지한 썸</option>
              <option value="연락 텀이 길어지며 서먹해진 상태">연락 텀이 길어지며 서먹해진 상태</option>
            </select>
          </div>

          {/* Context */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              대화 맥락 / 부가 상황 (선택)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="예: 방금 헤어지고 지하철 탔음, 답장이 4시간 만에 옴 등"
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* User Goal */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              나의 목표
            </label>
            <select
              value={userGoal}
              onChange={(e) => setUserGoal(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-2.5 text-sm text-stone-800 focus:outline-none focus:border-rose-400"
            >
              <option value="자연스럽게 대화 이어가며 호감 전하기">자연스럽게 티키타카 이어가기</option>
              <option value="다음 주말 만남(애프터) 자연스럽게 신청하기">다음 약속(애프터) 잡기</option>
              <option value="부담 없이 상대방을 안심/위로시키기">부담 없는 힐링 & 안심시키기</option>
              <option value="은근한 플러팅으로 설렘 유발하기">은근한 플러팅으로 설렘 유발하기</option>
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !receivedMessage.trim()}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>상대방 속마음 및 최적 답장 분석 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>답장 처방전 받기</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-4">
              {/* Psychology & Green Light Card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h4 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>상대방 속마음 & 신호 분석</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveToVault}
                      className="flex items-center gap-1 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
                      title="백엔드 서버 보관함에 저장"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-rose-600" />
                      <span>{isSavedToVault ? '서버 저장 완료 ✓' : '서버에 보관'}</span>
                    </button>
                    <span className="text-xs text-stone-500">호감도:</span>
                    <span className="text-xs font-bold text-rose-600 px-2 py-0.5 bg-rose-50 rounded">
                      {result.analysis.greenFlagScore}점
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 space-y-2">
                  <p className="text-sm text-stone-800 leading-relaxed">
                    {result.analysis.intent}
                  </p>
                  <div className="p-2.5 rounded-lg bg-stone-50 text-xs text-stone-600 flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>핵심 시그널: {result.analysis.signalSummary}</span>
                  </div>
                </div>

                {/* Timing Advice */}
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-amber-800 bg-amber-50/70 p-2.5 rounded-lg">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>추천 타이밍:</strong> {result.timingRecommendation}</span>
                </div>
              </div>

              {/* 3 Reply Options */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-stone-500">
                  맞춤 답장 옵션 (복사하여 바로 사용 가능)
                </div>

                {result.replyOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs hover:border-rose-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-rose-600">
                        옵션 {idx + 1}. {opt.toneName}
                      </span>
                      <button
                        onClick={() => handleCopy(opt.message, idx)}
                        className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-medium">복사됨!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>문구 복사</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* KakaoTalk Bubble Style */}
                    <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl text-stone-900 text-sm font-medium leading-relaxed my-2">
                      {opt.message}
                    </div>

                    <div className="text-xs text-stone-500 space-y-1">
                      <p>💡 {opt.whyItWorks}</p>
                      <p className="text-stone-400">💬 {opt.emojiTip}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Caution Warning */}
              <div className="p-4 rounded-xl bg-stone-900 text-stone-200 text-xs leading-relaxed flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-0.5">초보자 절대 주의사항</div>
                  <p className="text-stone-300">{result.cautionTip}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-white rounded-2xl border border-stone-200 p-8 shadow-xs flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h4 className="font-semibold text-stone-800 text-base mb-1">
                상대방의 카톡을 입력해보세요
              </h4>
              <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
                보내기 전 불안한 마음을 싹 지워드립니다. 상대방의 뉘앙스를 파악하고 가장 센스 있는 3가지 톤의 답장을 맞춤 처방해 드려요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
