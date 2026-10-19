import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RotateCcw, Copy, Check, MessageSquare, ShieldAlert, HeartHandshake, Database } from 'lucide-react';
import { CoachPersonaId, ChatMessage } from '../types';
import { COACH_PERSONAS, QUICK_PROMPTS } from '../data/coaches';
import { fetchUserData, saveChatHistoryToServer, clearChatHistoryOnServer } from '../services/storageApi';

export const ChatCoaching: React.FC = () => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<CoachPersonaId>('mentor');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const mentor = COACH_PERSONAS.find((c) => c.id === 'mentor')!;
    return [
      {
        id: 'msg-welcome',
        role: 'model',
        text: mentor.greeting,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        personaId: 'mentor',
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activePersona = COACH_PERSONAS.find((c) => c.id === selectedPersonaId) || COACH_PERSONAS[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load chat history from backend server on mount
  useEffect(() => {
    fetchUserData()
      .then((data) => {
        if (data.chatHistory && data.chatHistory.length > 0) {
          setMessages(data.chatHistory as ChatMessage[]);
        }
      })
      .catch((err) => {
        console.error('Failed to load chat history from server:', err);
      });
  }, []);

  const handleSelectPersona = (newPersonaId: CoachPersonaId) => {
    if (newPersonaId === selectedPersonaId) return;
    setSelectedPersonaId(newPersonaId);
    const targetPersona = COACH_PERSONAS.find((c) => c.id === newPersonaId)!;

    // Add greeting from the new coach
    const newGreeting: ChatMessage = {
      id: `greeting-${Date.now()}`,
      role: 'model',
      text: targetPersona.greeting,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      personaId: newPersonaId,
    };
    const nextMessages = [...messages, newGreeting];
    setMessages(nextMessages);
    saveChatHistoryToServer(nextMessages).catch(console.error);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      personaId: selectedPersonaId,
    };

    // Update conversation thread with user message
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');

    setIsLoading(true);

    try {
      // Build history for backend API (excluding current message)
      const history = updatedMessages.slice(0, -1).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history,
          message: userMsg.text,
          persona: selectedPersonaId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || '답변을 불러오지 못했습니다.');
      }

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || '답변이 없습니다.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        personaId: selectedPersonaId,
      };

      const finalMessages = [...updatedMessages, aiReply];
      setMessages(finalMessages);
      saveChatHistoryToServer(finalMessages).catch(console.error);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '상담 도중 연결이 원활하지 않습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = async () => {
    if (window.confirm('대화 내용을 초기화하고 처음 상태로 돌아갈까요? (서버 기록도 함께 삭제됩니다)')) {
      const currentPersona = COACH_PERSONAS.find((c) => c.id === selectedPersonaId)!;
      const initialMessages: ChatMessage[] = [
        {
          id: `welcome-${Date.now()}`,
          role: 'model',
          text: currentPersona.greeting,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          personaId: selectedPersonaId,
        },
      ];
      setMessages(initialMessages);
      setErrorMsg(null);
      try {
        await clearChatHistoryOnServer();
      } catch (e) {
        console.error('Failed to clear on server:', e);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Coach Selector & Advice Guide */}
      <div className="lg:col-span-4 space-y-4">
        {/* Coach Persona Selector */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-900 text-base flex items-center gap-2">
              <span>전담 AI 코치 선택</span>
            </h2>
            <span className="text-xs text-stone-400">언제든 교체 가능</span>
          </div>

          <div className="space-y-2.5">
            {COACH_PERSONAS.map((coach) => {
              const isSelected = selectedPersonaId === coach.id;
              return (
                <button
                  key={coach.id}
                  onClick={() => handleSelectPersona(coach.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-rose-300 bg-rose-50/70 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${coach.avatarBg}`}
                  >
                    {coach.avatarEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-stone-900 text-sm">{coach.name}</h3>
                      <span className="text-xs text-rose-600 font-medium">{coach.roleTitle}</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {coach.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2 text-[11px] text-stone-500">
                      {coach.tags.map((tag, i) => (
                        <span key={i} className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Crisis Prompts */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <h3 className="font-semibold text-stone-900 text-sm">초보자가 가장 많이 묻는 질문</h3>
          </div>
          <p className="text-xs text-stone-500 mb-3">
            클릭하면 즉시 코치에게 물어볼 수 있어요.
          </p>
          <div className="space-y-2">
            {QUICK_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                disabled={isLoading}
                className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:border-rose-300 hover:bg-rose-50/50 transition-colors text-xs text-stone-700 leading-snug group flex items-center justify-between"
              >
                <span className="font-medium text-stone-800">{item.label}</span>
                <span className="text-rose-500 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
                  질문하기 →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Beginner Heartfelt Reassurance */}
        <div className="p-4 rounded-xl bg-stone-100 text-stone-700 text-xs leading-relaxed space-y-1.5 border border-stone-200">
          <div className="font-semibold text-stone-900 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-rose-500" />
            <span>모든 질문은 비밀이 보장됩니다</span>
          </div>
          <p className="text-stone-600">
            “이런 걸 물어봐도 되나?” 싶은 사소한 걱정도 전혀 부끄러워하지 마세요. 누구나 연애는 처음이었고, 질문할수록 더 편안해집니다.
          </p>
        </div>
      </div>

      {/* Right Column: Multi-turn Chat Thread */}
      <div className="lg:col-span-8 flex flex-col h-[750px] bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Chat Thread Header */}
        <div className="px-5 py-3.5 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border ${activePersona.avatarBg}`}>
              {activePersona.avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-stone-900 text-sm">{activePersona.name}</h3>
                <span className="text-xs text-stone-500">· {activePersona.roleTitle}</span>
              </div>
              <p className="text-xs text-stone-500">실시간 멀티턴 코칭 세션 진행 중</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              title="대화 초기화"
              className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors flex items-center gap-1 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">대화 비우기</span>
            </button>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-stone-50/30">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const coach = COACH_PERSONAS.find((c) => c.id === msg.personaId) || activePersona;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div
                    className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-sm border mt-0.5 ${coach.avatarBg}`}
                  >
                    {coach.avatarEmoji}
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-xs relative group ${
                    isUser
                      ? 'bg-stone-900 text-white rounded-br-xs'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-xs'
                  }`}
                >
                  {/* Sender Name if AI */}
                  {!isUser && (
                    <div className="text-xs font-semibold text-rose-600 mb-1 flex items-center justify-between">
                      <span>{coach.name}</span>
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        title="답변 복사"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-400 hover:text-stone-600 p-1"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.text}
                  </div>

                  {/* Message Timestamp */}
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isUser ? 'text-stone-400' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-stone-900 text-white shrink-0 flex items-center justify-center text-xs font-medium mt-0.5">
                    나
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Typing Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div
                className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-sm border ${activePersona.avatarBg}`}
              >
                {activePersona.avatarEmoji}
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">
                  {activePersona.name}이 맞춤 조언을 작성하고 있습니다
                </span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`${activePersona.name}에게 고민이나 상황을 편하게 털어놓아 보세요... (Shift+Enter는 줄바꿈)`}
                rows={2}
                className="w-full resize-none rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-colors"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="h-11 px-4 sm:px-5 bg-rose-600 hover:bg-rose-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 text-sm shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">전송</span>
            </button>
          </form>
          <div className="mt-2 text-[11px] text-stone-400 text-center">
            모든 대화는 Gemini 모델을 통해 실시간으로 처리되며 학습 데이터로 노출되지 않습니다.
          </div>
        </div>
      </div>
    </div>
  );
};
