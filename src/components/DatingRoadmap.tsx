import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Sparkles, BookOpen, ChevronRight, Check, Database } from 'lucide-react';
import { DATING_ROADMAP, RoadmapStage } from '../data/roadmap';
import { fetchUserData, saveChecklistToServer } from '../services/storageApi';

export const DatingRoadmap: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>('stage-1');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isServerSynced, setIsServerSynced] = useState(false);

  useEffect(() => {
    // Load from backend server
    fetchUserData()
      .then((data) => {
        if (data.checklist) {
          setCheckedItems(data.checklist);
        }
      })
      .catch((err) => {
        console.error('Failed to load checklist from server:', err);
      });
  }, []);

  const toggleCheck = async (id: string) => {
    const next = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(next);
    setIsServerSynced(false);

    try {
      await saveChecklistToServer(next);
      setIsServerSynced(true);
      setTimeout(() => setIsServerSynced(false), 2500);
    } catch (e) {
      console.error('Failed to save to server:', e);
    }
  };

  const totalItems = DATING_ROADMAP.reduce((acc, stage) => acc + stage.items.length, 0);
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  const activeStage = DATING_ROADMAP.find((s) => s.id === activeStageId) || DATING_ROADMAP[0];

  return (
    <div className="space-y-6">
      {/* Intro Header & Progress Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-2">
              <BookOpen className="w-4 h-4" />
              <span>연애 초보 안심 핸드북</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              D-3 준비부터 애프터까지 실전 체크리스트
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
              사소한 것 하나 놓치지 않도록 단계별로 확인해보세요. 체크리스트를 하나씩 채워갈수록 불안감이 사라지고 자신감이 생깁니다.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 min-w-[220px]">
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5 font-medium">
              <span>준비 완료도</span>
              <span className="text-rose-600 font-bold">{progressPercent}% ({completedItems}/{totalItems})</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400">
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-rose-500" />
                <span>백엔드 서버 동기화</span>
              </span>
              {isServerSynced && (
                <span className="text-emerald-600 font-medium animate-pulse">
                  저장 완료 ✓
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stage Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-stone-100">
          {DATING_ROADMAP.map((stage) => {
            const isCurrent = activeStageId === stage.id;
            const stageCheckedCount = stage.items.filter((item) => checkedItems[item.id]).length;
            const isStageDone = stageCheckedCount === stage.items.length;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-rose-300 bg-rose-50/60 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-rose-600">{stage.badge}</span>
                  {isStageDone && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <h4 className="font-bold text-stone-900 text-sm">{stage.stageName}</h4>
                <p className="text-[11px] text-stone-500 truncate mt-0.5">{stage.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Checklist */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-stone-900 text-lg">
              {activeStage.stageName}: {activeStage.subtitle}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              항목을 클릭하면 완료 처리됩니다. 팁을 꼼꼼히 읽어보세요!
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {activeStage.items.map((item) => {
            const isDone = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isDone
                    ? 'bg-stone-50/80 border-stone-200 opacity-80'
                    : 'bg-white border-stone-200 hover:border-rose-300 hover:shadow-xs'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-rose-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 hover:text-rose-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-semibold ${
                        isDone ? 'line-through text-stone-500' : 'text-stone-900'
                      }`}
                    >
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-2 text-xs bg-rose-50/70 text-rose-800 p-2.5 rounded-lg border border-rose-100 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>실전 꿀팁:</strong> {item.tip}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
