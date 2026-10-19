import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Multi-turn AI Chat Coaching Endpoint
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { history = [], message, persona = 'mentor', relationshipStatus = 'beginner' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: '메시지를 입력해주세요.' });
      return;
    }

    const ai = getGenAI();

    let systemInstruction = '';
    switch (persona) {
      case 'realist':
        systemInstruction = `당신은 현실적이고 뼈때리는 팩트폭격 연애 코치 '민재 코치'입니다.
연애가 처음이거나 서툰 사람들에게 헛된 착각(김칫국)을 방지하고, 상대방의 실제 행동과 심리 시그널(그린라이트/어장관리/단순예의)을 냉철하고 현실적으로 분석해줍니다.
- 너무 차갑지는 않되, 불필요한 집착이나 감정 소모를 막아주는 명쾌하고 솔직한 어투 (~해요, ~입니다, 현실적으로 볼 때...)를 사용하세요.
- 초보자가 흔히 저지르는 '과도한 의미 부여'나 '조급함'을 차분하게 교정해주고, 다음 행동을 명확히 짚어주세요.`;
        break;

      case 'messaging':
        systemInstruction = `당신은 카톡 & 연락 소통 전문가 '수아 코치'입니다.
연애 초보자들이 가장 힘들어하는 카톡 티키타카, 답장 문구, 적절한 이모티콘 사용, 자연스럽게 약속(애프터) 잡는 멘트를 가르쳐줍니다.
- 항상 바로 복사해서 쓸 수 있는 '모범 예시 멘트'와 '보내는 타이밍/팁'을 제시해주세요.
- 상대방에게 부담을 주지 않으면서도 호기심을 유발하는 질문법과 대화의 흐름을 부드럽게 이끄는 기술을 친절하고 센스 있게 알려주세요.`;
        break;

      case 'roleplay_partner':
        systemInstruction = `당신은 첫 만남/소개팅을 연습할 수 있는 친절하고 매력적인 소개팅 대화 상대 '도윤/지수'입니다.
사용자는 연애가 처음인 초보자이며, 당신과 실전 대화(소개팅, 첫 데이트, 일상 카톡)를 시뮬레이션하고 있습니다.
- 소개팅 상대의 입장에서 리액션을 자연스럽고 따뜻하게 해주세요.
- 답변 끝에는 자연스럽게 상대방에게 다시 질문을 던져 대화가 이어지도록 해주세요.
- 만약 사용자가 답변하기 어려운 질문을 하거나 너무 어색한 표현을 쓰면 자연스럽게 넘어가되, 메시지 끝에 [💡 코치 한줄 팁: ...] 형식으로 아주 다정하게 피드백을 한 문장 남겨주세요.`;
        break;

      case 'mentor':
      default:
        systemInstruction = `당신은 연애가 처음인 모태솔로 및 연애 초보자들을 위한 따뜻하고 세심한 전담 멘토 '윤하 코치'입니다.
연애가 낯설고 두려운 사용자들의 마음에 깊이 공감하고, 아무리 사소해 보이는 질문(손 잡는 타이밍, 10분 지각 대처, 어색한 정적 대처, 옷차림 등)도 전혀 부끄럽지 않게 진심으로 격려하고 친절히 알려줍니다.
- 말투: 다정다감하고 믿음직한 선배 같은 말투 (~해보면 참 좋아요, 걱정하지 마세요, 당연히 처음엔 떨리는 법이에요).
- 답변 구성: 1) 공감 및 안도감 부여 2) 상황에 맞는 구체적인 행동 가이드(스텝 바이 스텝) 3) 초보자를 위한 핵심 한 줄 요약.`;
        break;
    }

    // Format history for Gemini API
    const formattedContents = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.role && item.text) {
          formattedContents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || '답변을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.',
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: error.message || '상담 처리 중 오류가 발생했습니다.',
    });
  }
});

// 2. KakaoTalk Message Analyzer & Reply Doctor
app.post('/api/reply-assistant', async (req: Request, res: Response): Promise<void> => {
  try {
    const { receivedMessage, relationshipStage, context, userGoal } = req.body;

    if (!receivedMessage) {
      res.status(400).json({ error: '상대방의 메시지를 입력해주세요.' });
      return;
    }

    const ai = getGenAI();

    const prompt = `
당신은 연애 초보자를 위한 '실전 카톡/메시지 답장 처방 연구소'입니다.
사용자가 상대방에게 받은 메시지와 현재 관계 맥락을 분석하고, 초보자가 안심하고 보낼 수 있는 3가지 톤의 맞춤 답장 옵션과 분석을 JSON 형태로 제공해주세요.

[입력 정보]
- 상대방이 보낸 메시지: "${receivedMessage}"
- 현재 관계 단계: ${relationshipStage || '소개팅 후 연락 중'}
- 대화 상황/맥락: ${context || '일상적인 대화 중'}
- 사용자의 목표: ${userGoal || '자연스럽게 대화를 이어가며 호감 전달하기'}

다음 JSON 스키마를 만족하는 결과만 반환하세요:
{
  "analysis": {
    "intent": "상대방 메시지의 속마음 및 숨은 뉘앙스 분석 (2~3문장)",
    "greenFlagScore": 85 (호감도/그린라이트 지수 0~100 숫자),
    "signalSummary": "예: 가벼운 호감 및 호기심 표현, 대화 지속 의지 있음"
  },
  "timingRecommendation": "추천 답장 타이밍 (예: 15~20분 뒤 자연스럽게 회신 추천, 즉답보다는 여유 있게)",
  "replyOptions": [
    {
      "toneName": "자연스러운 티키타카형 (부담 제로)",
      "message": "실제 전송할 수 있는 카톡 메시지 텍스트",
      "whyItWorks": "이 답장이 좋은 이유와 노림수",
      "emojiTip": "추천 이모티콘이나 느낌표 활용 팁"
    },
    {
      "toneName": "은근한 호감 & 심쿵형 (설렘 유발)",
      "message": "실제 전송할 수 있는 카톡 메시지 텍스트",
      "whyItWorks": "이 답장이 좋은 이유와 노림수",
      "emojiTip": "추천 이모티콘이나 느낌표 활용 팁"
    },
    {
      "toneName": "위트 & 센스형 (유쾌한 티키타카)",
      "message": "실제 전송할 수 있는 카톡 메시지 텍스트",
      "whyItWorks": "이 답장이 좋은 이유와 노림수",
      "emojiTip": "추천 이모티콘이나 느낌표 활용 팁"
    }
  ],
  "cautionTip": "초보자가 이번 답장에서 절대 피해야 할 주의점 (치명적인 실수 방지)"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/reply-assistant:', error);
    res.status(500).json({ error: error.message || '답장 분석 중 오류가 발생했습니다.' });
  }
});

// 3. First Date Planner & Course Creator
app.post('/api/date-planner', async (req: Request, res: Response): Promise<void> => {
  try {
    const { location, timeOfDay, vibe, budget, partnerInterests, dateStage } = req.body;

    const ai = getGenAI();

    const prompt = `
당신은 연애 초보자(모태솔로, 첫 소개팅, 첫 데이트)를 위한 '첫 데이트 안심 플래너'입니다.
초보자들은 긴장해서 정적이 오거나, 걷는 동선이 꼬이거나, 너무 시끄러운 식당에 가서 실패하는 경우가 많습니다.
이를 방지하는 완벽한 3단계 데이트 코스와 초보자 맞춤 행동/대화 팁을 JSON으로 작성해주세요.

[조건]
- 지역/만나는 곳: ${location || '서울 성수동/홍대/강남 중 적합한 곳'}
- 시간대: ${timeOfDay || '주말 오후 2시~저녁'}
- 원하는 분위기: ${vibe || '편안하고 자연스러운 대화 중심'}
- 예산대: ${budget || '1인당 2~4만원'}
- 상대방 관심사/특징: ${partnerInterests || '카페 투어, 맛있는 음식, 사진, 소소한 산책'}
- 데이트 단계: ${dateStage || '소개팅 후 첫 만남 (첫 데이트)'}

다음 JSON 스키마로 반환하세요:
{
  "title": "데이트 코스 제목 (예: 정적 없이 자연스럽게 녹아드는 성수동 3단 힐링 데이트)",
  "concept": "이 코스의 핵심 콘셉트 및 초보자에게 좋은 이유 (2문장)",
  "schedule": [
    {
      "step": 1,
      "time": "14:00 - 15:30",
      "placeType": "추천 장소 유형 (예: 채광 좋고 좌석 간격 넉넉한 캐주얼 브런치 카페)",
      "activity": "무엇을 하고 어떤 분위기를 만드는지",
      "conversationStarters": [
        "처음 앉았을 때 어색함 깨는 자연스러운 대화 주제 1",
        "자연스럽게 상대방 취향 묻는 질문 2"
      ],
      "beginnerMannerTip": "이 단계에서의 초보자 매너 팁 (예: 메뉴 고를 때 배려법, 물이나 티슈 챙기기 등)"
    },
    {
      "step": 2,
      "time": "15:45 - 17:00",
      "placeType": "추천 장소 유형 (예: 가볍게 걸으며 구경할 수 있는 편집숍/서점/공원)",
      "activity": "나란히 걸으며 자연스럽게 대화할 수 있는 활동",
      "conversationStarters": [
        "소품이나 풍경 보며 던질 수 있는 가벼운 질문 1",
        "상대방 웃게 만들 수 있는 공감 화제 2"
      ],
      "beginnerMannerTip": "나란히 걸을 때의 보폭 맞추기 및 시선 처리 팁"
    },
    {
      "step": 3,
      "time": "17:15 - 19:00",
      "placeType": "추천 장소 유형 (예: 소음이 적고 조명 은은한 정갈한 파스타/일식 다이닝)",
      "activity": "맛있는 식사와 함께 한층 더 가까워지는 시간",
      "conversationStarters": [
        "오늘 하루 즐거웠던 포인트 나누기",
        "자연스럽게 다음 약속(애프터) 떡밥 던지는 질문"
      ],
      "beginnerMannerTip": "식사 결제 시 자연스러운 제스처 및 첫 데이트 마무리 팁"
    }
  ],
  "emergencySilenceBreaker": "만약 둘 사이에 갑자기 10초 이상 정적이 찾아왔을 때 쓸 수 있는 만능 치트키 질문",
  "afterMessageSample": "데이트 끝난 후 당일 밤 보낼 자연스러운 애프터 연락 예시 문구"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/date-planner:', error);
    res.status(500).json({ error: error.message || '데이트 플랜 생성 중 오류가 발생했습니다.' });
  }
});

// 4. Situational Conversation Topic Generator
app.post('/api/generate-topics', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, partnerInfo, placeVibe } = req.body;

    const ai = getGenAI();

    const prompt = `
당신은 연애 초보자를 위한 '첫 데이트 대화 토픽 컨설턴트'입니다.
사용자가 첫 만남/초기 데이트에서 상대방과 어색함을 줄이고 즐거운 대화를 나눌 수 있는 맞춤형 대화 질문 4가지를 JSON으로 생성해주세요.

[입력 정보]
- 희망 대화 카테고리: ${category || '취미, 여행, 음식, 영화/콘텐츠, 최근 관심사 중 종합'}
- 상대방에 대해 아는 정보 (선택): ${partnerInfo || '특별한 사전 정보 없음 (일반적인 2030 소개팅 상대)'}
- 데이트 장소/상황 무드: ${placeVibe || '카페 또는 가벼운 식사 자리'}

다음 JSON 스키마로 반환하세요:
{
  "topics": [
    {
      "id": "gen-1",
      "category": "취미 / 여행 / 음식 / 영화·콘텐츠 / 최근 관심사 중 하나",
      "question": "자연스럽게 입 밖으로 낼 수 있는 따옴표 대화 질문 문장 (예: “혹시 주말에 푹 쉬실 때는 주로 어떤 거 하면서 에너지 충전하세요?”)",
      "timingTip": "이 질문을 던지기 가장 좋은 구체적인 순간/타이밍 (예: 식사 주문 후 음식을 기다릴 때)",
      "whyItWorks": "이 질문이 상대방의 부담을 덜고 대화를 즐겁게 만드는 심리적 이유",
      "followUpTips": [
        "상대방이 A라고 답했을 때 자연스러운 맞장구 및 꼬리 질문",
        "상대방이 B라고 답했을 때 분위기 살리는 리액션 팁"
      ],
      "cautionTip": "이 주제에서 절대 피해야 할 주의점"
    }
  ],
  "coachOneLiner": "첫 만남 대화 시 긴장감을 풀어주는 코치의 핵심 꿀팁 한 줄"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/generate-topics:', error);
    res.status(500).json({ error: error.message || '대화 주제 생성 중 오류가 발생했습니다.' });
  }
});

// 5. Dating Preferences & Conflict Harmonizer
app.post('/api/preference-harmonizer', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userTendency, partnerTendency, conflictScenario } = req.body;

    if (!userTendency && !conflictScenario) {
      res.status(400).json({ error: '나의 연애 선호 또는 갈등 상황을 입력해주세요.' });
      return;
    }

    const ai = getGenAI();

    const prompt = `
당신은 성숙한 관계 소통 전문가이자 연애 코칭 멘토입니다.
사용자가 자신의 연애 성향(가치관, 애정 표현, 갈등 해결 등)과 상대방의 다른 선호 사이에서 겪는 고민을 분석하고,
성격을 '불안형/회피형' 등으로 섣불리 단정하거나 무의미한 궁합 점수를 매기지 않고,
"서로 다른 선호를 온전히 이해하고 건강하게 조율하는 방법"을 JSON으로 제시해주세요.

[입력 정보]
- 나의 연애 선호: ${userTendency || '자주 연락하고 일상을 공유하는 게 중요한 편'}
- 상대방의 선호/태도: ${partnerTendency || '혼자만의 개인 시간과 에너지 충전이 필요한 편'}
- 구체적인 상황/고민: ${conflictScenario || '“나는 자주 연락하는 게 중요한데, 상대방은 혼자 있는 시간이 필요하대.”'}

[핵심 지침]
1. 누구 하나를 '가해자'나 '피해자'로 만들지 마세요. 둘의 선호는 모두 자연스러운 인간적 욕구입니다.
2. 성격이나 궁합을 점수로 재단하지 마세요. 대신 다름을 좁히는 소통 기술에 집중하세요.
3. 상대방의 입장을 악의나 애정 식음이 아닌 '에너지 충전/소통 방식의 차이'로 재해석하여 불안을 덜어주세요.
4. 비난 없는 '나 전달법(I-Message)' 스크립트와 둘만의 현실적 절충 룰을 제시하세요.

다음 JSON 스키마로 반환하세요:
{
  "summaryTitle": "상황을 따뜻하게 요약하는 제목 (예: 연결되고 싶은 나와, 충전이 필요한 너의 조율법)",
  "myNeedInsight": "나의 선호 뒤에 숨은 본질적인 욕구 분석 (왜 그게 내게 중요한지, 내 마음을 긍정해주는 글)",
  "partnerNeedInsight": "상대방의 선호 뒤에 숨은 심리와 메커니즘 (나를 덜 좋아해서가 아니라 어떻게 에너지를 쓰는 사람인지)",
  "mindsetShift": "초보자가 빠지기 쉬운 오해를 바로잡는 인식 전환 한 줄",
  "harmonizationRules": [
    {
      "step": 1,
      "ruleTitle": "절충 규칙 1 제목 (예: 출퇴근 안부 톡은 고정하고, 낮 시간 자유 보장하기)",
      "explanation": "이 규칙이 둘 모두를 편안하게 해주는 이유와 구체적인 실천법"
    },
    {
      "step": 2,
      "ruleTitle": "절충 규칙 2 제목 (예: 동굴 들어갈 때 ‘미리 예고’ 신호 만들기)",
      "explanation": "이 규칙이 둘 모두를 편안하게 해주는 이유와 구체적인 실천법"
    },
    {
      "step": 3,
      "ruleTitle": "절충 규칙 3 제목 (예: 상대방 충전 시간 동안 나만의 루틴 챙기기)",
      "explanation": "이 규칙이 둘 모두를 편안하게 해주는 이유와 구체적인 실천법"
    }
  ],
  "conversationScript": "상대방을 비난하지 않고 다정하게 마음을 전달할 수 있는 실제 대화 스크립트 (나 전달법 기반 따옴표 대사)",
  "checkQuestions": [
    "데이트할 때 둘이 함께 웃으며 상의해볼 수 있는 부드러운 질문 1",
    "상대방의 부담을 덜어주며 물어볼 수 있는 질문 2"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/preference-harmonizer:', error);
    res.status(500).json({ error: error.message || '성향 조율 분석 중 오류가 발생했습니다.' });
  }
});

// 6. Contextual Dating Dilemma Counselor
app.post('/api/situation-counselor', async (req: Request, res: Response): Promise<void> => {
  try {
    const { situationText, currentStage, myFeeling } = req.body;

    if (!situationText) {
      res.status(400).json({ error: '고민 상황을 입력해주세요.' });
      return;
    }

    const ai = getGenAI();

    const prompt = `
당신은 연애 초보자의 불안을 덜고 건강한 관점을 열어주는 '상황별 연애 고민 전문 카운슬러'입니다.
사용자가 자신의 연애 고민이나 불안한 상황을 털어놓았습니다.

[상황 입력]
- 사용자가 적은 상황: "${situationText}"
- 현재 관계 단계: ${currentStage || '썸 또는 초기 연애 중'}
- 사용자가 느끼는 감정: ${myFeeling || '불안함, 서운함, 혼란스러움'}

[상담 및 분석 핵심 지침]
1. 섣부른 독심술/단정 금지: "상대방 마음이 식은 게 확실합니다"라거나 "어장관리네요"처럼 단정짓지 마세요. 마음은 본인만 압니다.
2. 가능한 다각도 원인(3가지):
   - 원인 1: 상황적/에너지적 요인 (업무·학업 과부하, 체력 번아웃, 개인적 스트레스 등)
   - 원인 2: 관계 단계의 전환 (초기 아드레날린 긴장 단계에서 안정되고 편안한 일상 템포로의 전환)
   - 원인 3: 실제 호감도나 우선순위 변화의 가능성 (현실적으로 열어두되 비난하지 않고 짚기)
3. 감정 정리 및 수용: 사용자가 겪는 불안, 거절당할까 봐 드는 두려움, 과도한 혼자만의 추측(오버씽킹)을 온전히 수용하고 다독여주세요.
4. 직접 대화하는 실전 가이드: 추측으로 혼자 끙끙 앓거나 상대를 몰아세우지 않고, 안전하게 사실을 확인할 수 있는 '직접 대화 스크립트(나 전달법)'를 제시하세요.
5. 3가지 현실적 선택지(Action Paths)를 명확히 안내하세요.

다음 JSON 스키마로 반환하세요:
{
  "counselingTitle": "고민을 따뜻하게 관통하는 제목",
  "emotionValidation": "사용자의 불안한 감정을 충분히 인정하고 안도감을 주는 공감의 글 (2~3문장)",
  "possibleReasons": [
    {
      "title": "원인 1 제목 (예: 상황적 요인 - 업무 번아웃과 에너지 고갈)",
      "explanation": "이럴 가능성이 있는 이유와 정황 분석",
      "cautionIfAssumed": "이 상황에서 섣불리 '마음 식음'으로 단정했을 때 생기는 오해"
    },
    {
      "title": "원인 2 제목 (예: 관계 템포의 전환 - 초기 긴장감에서 일상적 편안함으로)",
      "explanation": "이럴 가능성이 있는 이유와 정황 분석",
      "cautionIfAssumed": "이 상황에서 섣불리 조급하게 굴었을 때 생기는 부작용"
    },
    {
      "title": "원인 3 제목 (예: 우선순위나 호감도의 변화 가능성)",
      "explanation": "냉정하지만 건강하게 고려해볼 수 있는 신호와 관점",
      "cautionIfAssumed": "과도하게 자책하거나 매달리지 않아야 하는 이유"
    }
  ],
  "actionChoices": [
    {
      "choiceName": "선택지 1. 가볍고 다정하게 컨디션 묻기",
      "recommendationWhen": "상대방이 바쁘거나 피곤해 보일 때 적합",
      "howToAct": "구체적인 행동 요령",
      "samplePhrase": "실제 보낼 수 있는 가벼운 카톡 문구"
    },
    {
      "choiceName": "선택지 2. 솔직한 내 마음 나누기 (직접 대화)",
      "recommendationWhen": "불안감이 며칠째 지속되어 직접 확인이 필요할 때 적합",
      "howToAct": "구체적인 행동 요령",
      "samplePhrase": "실제 보낼 수 있는 솔직하고 성숙한 대화 문구"
    },
    {
      "choiceName": "선택지 3. 연락 텀에 연연하지 않고 내 일상에 집중하기",
      "recommendationWhen": "내가 너무 상대방에게만 과몰입되어 있을 때 적합",
      "howToAct": "구체적인 행동 요령",
      "samplePhrase": "마음 다잡기 행동 지침"
    }
  ],
  "directDialogueScript": "만나서 또는 통화로 직접 진솔하게 물어볼 때 쓸 수 있는 다정한 나 전달법 대화문",
  "coachOneLiner": "과도한 뇌피셜과 불안을 잠재워주는 코치의 명쾌한 한마디"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/situation-counselor:', error);
    res.status(500).json({ error: error.message || '고민 상담 처리 중 오류가 발생했습니다.' });
  }
});

import { getDb, saveDb, SavedItem, DatingNote, ChatHistoryItem } from './server/storage.ts';

// 7. Backend Data Storage Endpoints
app.get('/api/user-data', async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    res.json(db);
  } catch (error: any) {
    console.error('Error in GET /api/user-data:', error);
    res.status(500).json({ error: '데이터를 불러오지 못했습니다.' });
  }
});

app.post('/api/user-data/checklist', async (req: Request, res: Response): Promise<void> => {
  try {
    const { checklist } = req.body;
    if (!checklist || typeof checklist !== 'object') {
      res.status(400).json({ error: '올바른 체크리스트 데이터가 아닙니다.' });
      return;
    }
    const db = await getDb();
    db.checklist = checklist;
    await saveDb(db);
    res.json({ success: true, checklist: db.checklist });
  } catch (error: any) {
    console.error('Error in POST /api/user-data/checklist:', error);
    res.status(500).json({ error: '체크리스트 저장에 실패했습니다.' });
  }
});

app.post('/api/user-data/preferences', async (req: Request, res: Response): Promise<void> => {
  try {
    const { preferences } = req.body;
    const db = await getDb();
    db.preferences = {
      ...db.preferences,
      ...preferences,
      updatedAt: new Date().toISOString(),
    };
    await saveDb(db);
    res.json({ success: true, preferences: db.preferences });
  } catch (error: any) {
    console.error('Error in POST /api/user-data/preferences:', error);
    res.status(500).json({ error: '성향 정보 저장에 실패했습니다.' });
  }
});

app.post('/api/user-data/chat-history', async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatHistory } = req.body;
    if (!Array.isArray(chatHistory)) {
      res.status(400).json({ error: '올바른 대화 기록 형식이 아닙니다.' });
      return;
    }
    const db = await getDb();
    db.chatHistory = chatHistory;
    await saveDb(db);
    res.json({ success: true, count: db.chatHistory.length });
  } catch (error: any) {
    console.error('Error in POST /api/user-data/chat-history:', error);
    res.status(500).json({ error: '대화 기록 저장에 실패했습니다.' });
  }
});

app.delete('/api/user-data/chat-history', async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    db.chatHistory = [];
    await saveDb(db);
    res.json({ success: true, message: '대화 기록이 초기화되었습니다.' });
  } catch (error: any) {
    console.error('Error in DELETE /api/user-data/chat-history:', error);
    res.status(500).json({ error: '대화 기록 삭제에 실패했습니다.' });
  }
});

app.post('/api/user-data/favorites', async (req: Request, res: Response): Promise<void> => {
  try {
    const { item } = req.body;
    if (!item || !item.type || !item.title) {
      res.status(400).json({ error: '보관할 항목 정보가 올바르지 않습니다.' });
      return;
    }
    const db = await getDb();
    const newItem: SavedItem = {
      id: item.id || `fav-${Date.now()}`,
      type: item.type,
      title: item.title,
      summary: item.summary || '',
      content: item.content || {},
      createdAt: item.createdAt || new Date().toISOString(),
    };
    // Prepend to favorites
    db.savedFavorites = [newItem, ...db.savedFavorites.filter((f) => f.id !== newItem.id)];
    await saveDb(db);
    res.json({ success: true, savedFavorites: db.savedFavorites });
  } catch (error: any) {
    console.error('Error in POST /api/user-data/favorites:', error);
    res.status(500).json({ error: '보관함 저장에 실패했습니다.' });
  }
});

app.delete('/api/user-data/favorites/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const db = await getDb();
    db.savedFavorites = db.savedFavorites.filter((f) => f.id !== id);
    await saveDb(db);
    res.json({ success: true, savedFavorites: db.savedFavorites });
  } catch (error: any) {
    console.error('Error in DELETE /api/user-data/favorites:', error);
    res.status(500).json({ error: '보관함 항목 삭제에 실패했습니다.' });
  }
});

app.post('/api/user-data/notes', async (req: Request, res: Response): Promise<void> => {
  try {
    const { note } = req.body;
    if (!note || !note.title) {
      res.status(400).json({ error: '노트 제목을 입력해주세요.' });
      return;
    }
    const db = await getDb();
    const existingIndex = db.datingNotes.findIndex((n) => n.id === note.id);
    const updatedNote: DatingNote = {
      id: note.id || `note-${Date.now()}`,
      title: note.title,
      content: note.content || '',
      tags: Array.isArray(note.tags) ? note.tags : [],
      partnerLikes: note.partnerLikes || '',
      partnerDislikes: note.partnerDislikes || '',
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      db.datingNotes[existingIndex] = updatedNote;
    } else {
      db.datingNotes.unshift(updatedNote);
    }
    await saveDb(db);
    res.json({ success: true, datingNotes: db.datingNotes });
  } catch (error: any) {
    console.error('Error in POST /api/user-data/notes:', error);
    res.status(500).json({ error: '노트 저장에 실패했습니다.' });
  }
});

app.delete('/api/user-data/notes/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const db = await getDb();
    db.datingNotes = db.datingNotes.filter((n) => n.id !== id);
    await saveDb(db);
    res.json({ success: true, datingNotes: db.datingNotes });
  } catch (error: any) {
    console.error('Error in DELETE /api/user-data/notes:', error);
    res.status(500).json({ error: '노트 삭제에 실패했습니다.' });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
