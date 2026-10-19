import React, { useState } from 'react';
import { MapPin, Clock, Compass, Coffee, Utensils, Footprints, Sparkles, AlertCircle, Copy, Check, Bookmark } from 'lucide-react';
import { DatePlanResult } from '../types';
import { saveFavoriteToServer } from '../services/storageApi';

const POPULAR_LOCATIONS = [
  '서울 성수동/서울숲',
  '서울 홍대/연남동',
  '서울 강남/신사 가로수길',
  '서울 혜화/대학로',
  '서울 안국/삼청동',
  '경기도 판교/분당',
  '부산 전포/서면',
];

export const DatePlanner: React.FC = () => {
  const [location, setLocation] = useState('서울 성수동/서울숲');
  const [timeOfDay, setTimeOfDay] = useState('주말 오후 2시 ~ 저녁');
  const [vibe, setVibe] = useState('어색함 없는 편안한 대화 중심');
  const [budget, setBudget] = useState('1인당 2~4만원 (부담 없는 선)');
  const [partnerInterests, setPartnerInterests] = useState('카페 투어, 맛있는 음식, 사진 찍기, 가벼운 산책');
  const [dateStage, setDateStage] = useState('소개팅 후 첫 만남 (첫 데이트)');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DatePlanResult | null>(null);
  const [copiedAfterMsg, setCopiedAfterMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSavedToVault, setIsSavedToVault] = useState(false);

  const handleSaveDatePlan = async () => {
    if (!result) return;
    try {
      await saveFavoriteToServer({
        type: 'date_plan',
        title: `데이트 코스: ${result.title}`,
        summary: result.concept,
        content: result,
      });
      setIsSavedToVault(true);
      setTimeout(() => setIsSavedToVault(false), 2500);
    } catch (e) {
      alert('코스 저장에 실패했습니다.');
    }
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/date-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          timeOfDay,
          vibe,
          budget,
          partnerInterests,
          dateStage,
        }),
      });

      if (!res.ok) {
        throw new Error('코스를 생성하지 못했습니다. 잠시 후 다시 시도해주세요.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '데이트 코스 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAfter = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAfterMsg(true);
    setTimeout(() => setCopiedAfterMsg(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-2">
          <Compass className="w-4 h-4" />
          <span>첫 데이트 안심 플래너</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          어색한 침묵과 긴장 없는 3단계 맞춤 데이트 코스
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          초보자의 첫 데이트 실패 원인은 90%가 '너무 긴 식사 시간', '웨이팅으로 인한 지침', '대화 주제 고갈' 때문입니다. 동선과 대화 토픽이 완벽히 설계된 코스를 확인하세요.
        </p>

        {/* Quick Location Chips */}
        <div className="mt-4 flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-stone-500 font-medium mr-1">추천 지역:</span>
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocation(loc)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                location === loc
                  ? 'bg-rose-50 border-rose-300 text-rose-700 font-medium'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Setup Parameters */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h3 className="font-semibold text-stone-900 text-base">데이트 조건 설정</h3>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              만날 지역 / 위치
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 서울 성수동, 대구 동성로, 수원 행궁동 등"
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              만나는 시간대
            </label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-2.5 text-sm text-stone-800 focus:outline-none focus:border-rose-400"
            >
              <option value="주말 오후 2시 ~ 저녁">주말 오후 (오후 2시 ~ 저녁)</option>
              <option value="주말 점심 (낮 12시 ~ 오후 4시)">주말 점심 (낮 12시 ~ 오후 4시)</option>
              <option value="평일 퇴근 후 저녁 (오후 6시 30분 ~ 9시)">평일 퇴근 후 저녁</option>
              <option value="주말 늦은 저녁 가벼운 맥주/와인">주말 늦은 저녁 (가벼운 펍/바)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              원하는 데이트 무드
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-2.5 text-sm text-stone-800 focus:outline-none focus:border-rose-400"
            >
              <option value="어색함 없는 편안한 대화 중심">어색함 없는 편안한 대화 중심</option>
              <option value="조용하고 감성적인 아늑한 분위기">조용하고 감성적인 아늑한 분위기</option>
              <option value="볼거리와 소품샵이 많은 활동형">볼거리와 소품샵이 많은 활동형</option>
              <option value="맛있는 음식과 트렌디한 핫플레이스">맛있는 음식 & 트렌디한 핫플레이스</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              상대방 관심사 / 취향
            </label>
            <input
              type="text"
              value={partnerInterests}
              onChange={(e) => setPartnerInterests(e.target.value)}
              placeholder="예: 강아지, 베이커리, 사진, 서점, 일본 음식 등"
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={isLoading || !location.trim()}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>초보자 맞춤 코스 설계 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>3단계 안심 코스 생성</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Schedule & Advice Output */}
        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-5">
              {/* Plan Header */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-600">추천 맞춤 코스</span>
                  <button
                    onClick={handleSaveDatePlan}
                    className="flex items-center gap-1 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    title="백엔드 서버 보관함에 저장"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-rose-600" />
                    <span>{isSavedToVault ? '서버 저장 완료 ✓' : '서버에 보관'}</span>
                  </button>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mt-1">{result.title}</h3>
                <p className="text-sm text-stone-600 mt-1 leading-relaxed">{result.concept}</p>
              </div>

              {/* 3 Steps Timeline */}
              <div className="space-y-4">
                {result.schedule.map((item) => (
                  <div
                    key={item.step}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center">
                          {item.step}
                        </span>
                        <h4 className="font-semibold text-stone-900 text-sm">{item.placeType}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 mb-3">{item.activity}</p>

                    {/* Conversation Starters for this spot */}
                    <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3 mb-2.5">
                      <div className="text-[11px] font-semibold text-rose-700 mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>이 장소에서 자연스럽게 던질 대화 주제</span>
                      </div>
                      <ul className="space-y-1">
                        {item.conversationStarters.map((talk, idx) => (
                          <li key={idx} className="text-xs text-stone-700 flex items-start gap-1.5">
                            <span className="text-rose-400">·</span>
                            <span>{talk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Manner Tip */}
                    <div className="text-xs text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      <strong>💡 초보자 매너 팁:</strong> {item.beginnerMannerTip}
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency Silence Breaker */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>비상 상황: 갑자기 10초 이상 정적이 찾아왔을 때 치트키</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  “{result.emergencySilenceBreaker}”
                </p>
                <p className="text-[11px] text-amber-700 mt-1">
                  정적이 흐를 때 당황해서 두리번거리지 말고, 물을 한 모금 마신 뒤 가볍게 웃으며 위 질문을 건네보세요.
                </p>
              </div>

              {/* After Message Sample */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-900">
                    데이트 종료 후 귀가길에 보낼 모범 애프터 카톡
                  </span>
                  <button
                    onClick={() => handleCopyAfter(result.afterMessageSample)}
                    className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition-colors"
                  >
                    {copiedAfterMsg ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">복사됨!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>카톡 문구 복사</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-800 leading-relaxed font-medium border border-stone-100">
                  {result.afterMessageSample}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-white rounded-2xl border border-stone-200 p-8 shadow-xs flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7" />
              </div>
              <h4 className="font-semibold text-stone-800 text-base mb-1">
                지역과 분위기를 선택하고 코스를 생성하세요
              </h4>
              <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
                어디로 갈지, 무슨 말을 할지 막막할 때 3단계 맞춤 동선과 실시간 대화 치트키를 한눈에 볼 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
