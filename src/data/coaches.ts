import { CoachPersona } from '../types';

export const COACH_PERSONAS: CoachPersona[] = [
  {
    id: 'mentor',
    name: '윤하 코치',
    roleTitle: '다정한 전담 멘토',
    avatarBg: 'bg-rose-100 text-rose-600 border-rose-200',
    avatarEmoji: '🌸',
    description: '연애 초보의 불안과 서툰 감정을 따뜻하게 보듬어주는 든든한 멘토',
    greeting: '안녕하세요! 연애가 처음이라 막막하고 떨리시죠? 사소하게 느껴지는 질문이라도 괜찮아요. 손 잡는 타이밍, 옷차림, 연락 텀까지 편하게 물어보세요. 하나씩 차근차근 함께 풀어가요!',
    tags: ['공감과 격려', '자존감 부스터', '사소한 고민 환영'],
  },
  {
    id: 'realist',
    name: '민재 코치',
    roleTitle: '현실적 팩트폭격기',
    avatarBg: 'bg-amber-100 text-amber-700 border-amber-200',
    avatarEmoji: '⚡',
    description: '상대방의 행동과 연락 텀을 냉철하고 객관적으로 분석해주는 실전형 코치',
    greeting: '반갑습니다! 김칫국은 마시지 않고, 쓸데없는 불안도 덜어드립니다. 상대방의 사소한 행동 하나에 온종일 머리 싸매고 계신가요? 상황을 그대로 알려주시면 객관적 그린라이트 여부와 다음 수를 짚어드릴게요.',
    tags: ['어장관리 판독', '그린라이트 검증', '김칫국 방지'],
  },
  {
    id: 'messaging',
    name: '수아 코치',
    roleTitle: '카톡 & 티키타카 마스터',
    avatarBg: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    avatarEmoji: '💬',
    description: '어색한 단답을 설레는 티키타카로 바꾸고 자연스럽게 약속을 이끄는 센스 코치',
    greeting: '안녕하세요! 카톡 보낼 때마다 전송 버튼 누르기 전에 3번씩 지웠다 썼다 하시나요? 상대방이 기분 좋게 답장하고 싶어지는 멘트와 자연스러운 데이트 유도법을 알려드릴게요!',
    tags: ['카톡 문구 처방', '단답 탈출', '자연스러운 애프터'],
  },
  {
    id: 'roleplay_partner',
    name: '도윤 / 지수',
    roleTitle: '1:1 소개팅 리허설 파트너',
    avatarBg: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    avatarEmoji: '🎭',
    description: '실제 소개팅 상대방이 되어 대화를 주고받으며 피드백을 주는 시뮬레이션 파트너',
    greeting: '안녕하세요! 오늘 소개팅 자리라고 생각하고 편안하게 첫인사 건네주세요. "주말에 뭐 하셨어요?"나 "커피 좋아하세요?"처럼 편하게 말 걸어주시면 실전처럼 대화해볼게요!',
    tags: ['실전 대화 연습', '정적 대처 훈련', '실시간 피드백'],
  },
];

export const QUICK_PROMPTS = [
  {
    label: '카톡 텀 고민',
    prompt: '상대방이 평소보다 답장이 3~4시간 늦는데, 제가 선톡을 보내도 괜찮을까요? 아니면 기다려야 할까요?',
  },
  {
    label: '첫 만남 정적 대처',
    prompt: '소개팅에서 대화가 뚝 끊기고 어색한 정적이 흐를 때, 자연스럽게 화제를 돌릴 수 있는 만능 질문 알려주세요.',
  },
  {
    label: '자연스러운 애프터',
    prompt: '첫 데이트가 끝났는데 다음 주말에 또 만나자고 부담스럽지 않게 애프터 신청하는 카톡 문구 추천해주세요.',
  },
  {
    label: '호감 시그널 확인',
    prompt: '상대방이 저한테 호감이 있는 건지, 아니면 그냥 성격상 친절한 건지 구분하는 확실한 3가지 신호가 궁금해요.',
  },
  {
    label: '첫 데이트 결제 매너',
    prompt: '첫 만남에서 밥값과 카페 비용 계산할 때 초보자가 센스 있게 대처하는 팁이 궁금해요. 더치페이 해야 하나요?',
  },
  {
    label: '스킨십/손잡기 타이밍',
    prompt: '연애 경험이 없어서 손을 언제 어떻게 잡아야 할지 너무 긴장돼요. 자연스럽고 거부감 없는 타이밍이 언제인가요?',
  },
];
