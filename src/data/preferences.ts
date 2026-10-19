export interface PreferenceQuestion {
  id: string;
  category: 'contact' | 'expression' | 'conflict' | 'pace';
  categoryLabel: string;
  title: string;
  description: string;
  options: {
    label: string;
    description: string;
    myCoreValue: string;
  }[];
}

export interface PresetDilemma {
  id: string;
  title: string;
  userNeed: string;
  partnerNeed: string;
  scenario: string;
}

export const PREFERENCE_QUESTIONS: PreferenceQuestion[] = [
  {
    id: 'q-contact',
    category: 'contact',
    categoryLabel: '연락 & 개인 공간',
    title: '연락 텀과 나만의 시간에 대한 나의 자연스러운 선호는?',
    description: '어떤 방식이 옳고 그른 것이 아니라, 내가 가장 마음 편안함을 느끼는 방식입니다.',
    options: [
      {
        label: '밀착 소통형',
        description: '사소한 일상(출근, 점심, 퇴근)을 자주 나누고 연결되어 있다는 느낌이 들 때 안정돼요.',
        myCoreValue: '자주 연락하고 일상을 공유하며 정서적 연결감을 확인하는 것이 중요함',
      },
      {
        label: '안부 중심 & 집중형',
        description: '출퇴근/자기 전 안부 톡은 꼬박꼬박 하되, 낮 시간에는 각자의 일이나 공부에 몰입하고 싶어요.',
        myCoreValue: '기본적인 안부 신뢰를 바탕으로 낮 시간의 집중과 효율을 존중받는 것이 중요함',
      },
      {
        label: '독립 충전형 (동굴 필요)',
        description: '퇴근 후나 주말에 혼자 푹 쉬며 에너지를 채우는 나만의 시간이 꼭 보장되어야 해요.',
        myCoreValue: '혼자만의 고요한 시간과 독립성을 통해 에너지를 재충전하는 공간이 중요함',
      },
    ],
  },
  {
    id: 'q-expression',
    category: 'expression',
    categoryLabel: '애정 표현 언어',
    title: '상대방의 마음이 가장 확실하게 전해지는 순간은 언제인가요?',
    description: '사람마다 사랑을 느끼는 채널이 다릅니다. 나에게 가장 와닿는 표현 방식은?',
    options: [
      {
        label: '말과 칭찬의 언어',
        description: '“고마워”, “오늘 예쁘다”, “보고 싶다”처럼 솔직하고 다정한 말로 표현해줄 때 심쿵해요.',
        myCoreValue: '언어적 인정과 따뜻한 칭찬, 솔직한 마음 표현을 통해 사랑을 확신함',
      },
      {
        label: '온전한 함께함 (퀄리티 타임)',
        description: '바쁜 일정 속에서도 스마트폰을 내려놓고 온전히 내 눈을 보며 대화해줄 때 사랑을 느껴요.',
        myCoreValue: '온전히 나에게 집중해주는 방해 없는 시간과 경청을 통해 교감함',
      },
      {
        label: '세심한 행동과 챙김',
        description: '길 안쪽으로 걷게 해주기, 물 챙겨주기, 아플 때 약 사다주기처럼 묵묵한 배려가 좋아요.',
        myCoreValue: '말보다 실질적으로 나를 위하는 배려 깊은 행동과 헌신을 통해 안정감을 느낌',
      },
      {
        label: '다정한 스킨십과 온기',
        description: '자연스럽게 손을 잡거나 가볍게 어깨를 기댈 때 정서적인 유대감이 가장 깊어져요.',
        myCoreValue: '체온과 신체적 친밀감, 따뜻한 스킨십을 통해 정서적 유대를 느낌',
      },
    ],
  },
  {
    id: 'q-conflict',
    category: 'conflict',
    categoryLabel: '갈등 해결 & 서운함',
    title: '서운하거나 감정이 상했을 때, 내가 편안한 화해 방식은?',
    description: '서로 다른 템포를 인정하지 않으면 갈등이 눈덩이처럼 커지기 쉽습니다.',
    options: [
      {
        label: '즉각적인 대화형',
        description: '감정을 묵혀두면 가슴이 답답해요. 그날 안에 바로 터놓고 대화해서 풀어야 잠이 와요.',
        myCoreValue: '오해가 쌓이기 전에 즉시 소통하여 관계의 안정성을 확인하고 불안을 해소함',
      },
      {
        label: '쿨타임 후 차분한 대화형',
        description: '흥분했을 때 말하면 상처를 줄 수 있어요. 1~2시간 혼자 생각을 정리한 후 차분하게 대화하고 싶어요.',
        myCoreValue: '감정이 격해진 상태를 피하고 이성적으로 정리된 언어로 상처 주지 않고 해결함',
      },
      {
        label: '부드러운 간접 신호형',
        description: '직접적으로 따지면 싸움이 될까 봐 두려워요. 완곡하게 신호를 주거나 부드러운 분위기에서 풀고 싶어요.',
        myCoreValue: '충돌의 날카로움을 최소화하고 상대방을 배려하며 부드러운 톤으로 서운함을 전달함',
      },
    ],
  },
  {
    id: 'q-pace',
    category: 'pace',
    categoryLabel: '데이트 리듬 & 라이프 밸런스',
    title: '데이트 계획과 빈도에 대한 나의 자연스러운 선호는?',
    description: '연애가 일상과 어떻게 조화를 이루길 바라는지 알아봅니다.',
    options: [
      {
        label: '계획적 안정형',
        description: '미리 장소와 시간을 정해두고 준비하는 데이트에서 편안함과 설렘을 느껴요.',
        myCoreValue: '예측 가능한 일정과 정성스러운 사전 계획을 통해 존중받는다고 느낌',
      },
      {
        label: '자유로운 즉흥형',
        description: '그날 기분이나 날씨에 따라 여유롭게 발길 닿는 대로 맛집 찾아가는 게 낭만적이에요.',
        myCoreValue: '틀에 얽매이지 않고 편안한 순간의 느낌과 유연성을 만끽하고 싶음',
      },
      {
        label: '균형 우선형',
        description: '연애도 소중하지만 각자의 일, 친구, 개인 취미 생활과의 건강한 균형이 유지되어야 해요.',
        myCoreValue: '연애가 서로의 삶을 갉아먹지 않고 독립적인 성장과 균형을 이루길 바람',
      },
    ],
  },
];

export const PRESET_DILEMMAS: PresetDilemma[] = [
  {
    id: 'dilemma-1',
    title: '연락 텀 vs 혼자만의 동굴 시간',
    userNeed: '나는 자주 연락하고 일상을 나누는 게 중요한데',
    partnerNeed: '상대방은 혼자 푹 쉬는 동굴 시간이 필요하다고 해요',
    scenario: '“나는 자주 연락하는 게 중요한데, 상대방은 혼자 있는 시간이 필요하대.”',
  },
  {
    id: 'dilemma-2',
    title: '즉각적인 대화 vs 생각할 시간(쿨타임)',
    userNeed: '서운한 게 생기면 그 자리에서 바로 대화로 풀어야 직성이 풀리는데',
    partnerNeed: '상대방은 감정이 가라앉을 때까지 입을 닫고 혼자 생각할 시간을 달라고 해요',
    scenario: '“갈등이 생기면 저는 바로 풀고 싶은데 상대방은 회피하듯 말을 안 하려고 해요.”',
  },
  {
    id: 'dilemma-3',
    title: '말과 표현 확인 vs 무뚝뚝한 행동형',
    userNeed: '나는 다정한 말과 애정 표현을 자주 듣고 싶은데',
    partnerNeed: '상대방은 표현이 서툴고 말보다는 행동으로 보여주면 되지 않냐고 해요',
    scenario: '“‘좋아한다/예쁘다’는 말을 자주 듣고 확인받고 싶은데 상대방이 너무 무뚝뚝해요.”',
  },
  {
    id: 'dilemma-4',
    title: '매주 데이트 vs 개인 일정/친구 밸런스',
    userNeed: '나는 주말마다 만나서 함께 시간을 보내고 싶은데',
    partnerNeed: '상대방은 친구 모임이나 개인 취미 시간도 똑같이 소중하게 챙기려 해요',
    scenario: '“주말에 나랑만 데이트하기를 바라는 나와, 다른 친구 모임도 챙기려는 상대방.”',
  },
];
