export type ConversationCategory =
  | 'all'
  | 'hobby'
  | 'travel'
  | 'food'
  | 'movie'
  | 'trend'
  | 'icebreaker'
  | 'taboo';

export interface ConversationCard {
  id: string;
  category: ConversationCategory;
  categoryLabel: string;
  situationTag: string; // e.g. "첫 만남 직후", "메뉴 고를 때", "식사 도중", "카페에서", "이동 중", "정적 위기"
  question: string;
  contextTip: string;
  whyItWorks: string;
  followUpExample: string;
  dangerPoint?: string;
  isTaboo?: boolean;
}

export const CONVERSATION_CATEGORIES: { id: ConversationCategory; label: string; icon: string }[] = [
  { id: 'all', label: '전체 보기', icon: '✨' },
  { id: 'hobby', label: '취미 & 여가', icon: '🎨' },
  { id: 'travel', label: '여행 & 힐링', icon: '✈️' },
  { id: 'food', label: '음식 & 미식', icon: '🍽️' },
  { id: 'movie', label: '영화 & 콘텐츠', icon: '🎬' },
  { id: 'trend', label: '최근 관심사 & 일상', icon: '🔥' },
  { id: 'icebreaker', label: '상황별 아이스브레이킹', icon: '🧊' },
  { id: 'taboo', label: '⚠️ 절대 금기 질문', icon: '🚫' },
];

export const CONVERSATION_CARDS: ConversationCard[] = [
  // ==========================================
  // 1. 취미 & 여가 (Hobbies & Leisure)
  // ==========================================
  {
    id: 'hobby-1',
    category: 'hobby',
    categoryLabel: '취미 & 여가',
    situationTag: '대화 초중반 / 편안해졌을 때',
    question: '“혹시 주말에 약속 없거나 완전 자유시간 생기면, 보통 집에서 충전하는 집돌이/집순이파세요, 아니면 일단 나가야 하는 밖순이/밖돌이파세요?”',
    contextTip: '단순히 “취미가 뭐예요?”라고 묻는 대신 성향으로 가볍게 접근할 때',
    whyItWorks: '“취미가 뭐냐”는 질문은 특별한 취미가 없는 사람에게 부담을 줍니다. 집/밖 선택지는 누구나 1초 만에 대답할 수 있고, 자연스럽게 주말 일상 루틴으로 이어집니다.',
    followUpExample: '“집돌이파시군요! 저도 집에서 이불 덮고 넷플릭스 보거나 맛있는 배달음식 시켜먹는 거 제일 좋아해요. 최근에 집에서 몰아본 거 있으세요?”',
    dangerPoint: '상대방이 “그냥 누워있어요”라고 해도 “에이 너무 게으른 거 아니에요?” 같은 부정적 평가는 절대 금물입니다.',
  },
  {
    id: 'hobby-2',
    category: 'hobby',
    categoryLabel: '취미 & 여가',
    situationTag: '음료 마시며 여유로울 때',
    question: '“요즘 퇴근하고 나서나 주말에 사소하게라도 푹 빠져 있거나 재미 붙인 거 있으세요? 운동이든 게임이든 유튜브든요!”',
    contextTip: '거창한 취미가 아닌 ‘소소한 몰입거리’를 편안하게 물어볼 때',
    whyItWorks: '‘사소하게라도’라는 단어가 문턱을 크게 낮춰줍니다. 상대방이 최근 꽂힌 대상을 신나게 이야기하면서 눈빛이 반짝이게 됩니다.',
    followUpExample: '“러닝 시작하셨다고요? 오! 요즘 러닝 크루도 많던데, 보통 몇 km 정도 뛰세요? 뛰고 나면 진짜 개운하죠?”',
    dangerPoint: '내가 모르는 분야라도 무시하지 말고 호기심 어린 리액션을 보내주세요.',
  },
  {
    id: 'hobby-3',
    category: 'hobby',
    categoryLabel: '취미 & 여가',
    situationTag: '식사 후 카페에서',
    question: '“만약 1주일 동안 시간과 예산이 무제한으로 주어진다면, 평소 꼭 배워보고 싶었던 원데이 클래스나 취미가 있으세요?”',
    contextTip: '상상력을 자극하며 상대방의 숨은 호기심을 탐색할 때',
    whyItWorks: '일상의 제약에서 벗어난 질문이라 상대방의 로망이나 감성을 자연스럽게 들을 수 있습니다.',
    followUpExample: '“도자기 공방이요? 와, 흙 만지는 거 되게 힐링되잖아요. 나중에 컵이나 접시 만들면 진짜 뿌듯하겠어요!”',
    dangerPoint: '현실적인 제약(“그거 비싸잖아요”)을 따지지 말고 로망에 함께 공감해주세요.',
  },

  // ==========================================
  // 2. 여행 & 힐링 (Travel & Adventures)
  // ==========================================
  {
    id: 'travel-1',
    category: 'travel',
    categoryLabel: '여행 & 힐링',
    situationTag: '식사 중 또는 카페에서',
    question: '“지금까지 다녀오신 여행지 중에 ‘여기는 언젠가 꼭 한 번 다시 가고 싶다’ 하는 인생 여행지가 있으세요?”',
    contextTip: '서로의 취향을 나누며 긍정적인 추억을 떠올리게 할 때',
    whyItWorks: '여행 이야기를 할 때 사람은 행복했던 호르몬이 분비되며, 말하는 상대방(나)에게도 무의식중에 긍정적이고 설레는 감정을 투영하게 됩니다.',
    followUpExample: '“제주도 서쪽 해안도로요? 저도 노을 볼 때 멍때리는 거 너무 좋아하는데, 혹시 거기서 기억에 남는 카페나 숙소 있으셨어요?”',
    dangerPoint: '자랑 배틀(“저는 유럽 20개국 가봤는데” 등)로 이어지지 않도록 상대방 이야기에 집중하세요.',
  },
  {
    id: 'travel-2',
    category: 'travel',
    categoryLabel: '여행 & 힐링',
    situationTag: '자연스러운 대화 전환 시',
    question: '“여행 가실 때 스타일이 어떠세요? 분 단위로 엑셀 짜는 파워 J 계획형이세요, 아니면 발길 닿는 대로 맛집 찾아가는 P 즉흥형이세요?”',
    contextTip: 'MBTI나 여행 에피소드로 분위기를 유쾌하게 띄울 때',
    whyItWorks: '극과 극의 성향을 비교하며 웃음 섞인 에피소드를 끌어내기 가장 좋은 만능 치트키입니다.',
    followUpExample: '“완전 P시군요 ㅋㅋㅋ 길 잃었다가 우연히 발견한 골목길 식당에서 인생 맛집 찾았을 때 희열 장난 아니죠!”',
    dangerPoint: '상대방 성향을 비난하거나 가르치려 들지 마세요 (예: “계획 안 짜면 피곤하지 않나요?” 금지).',
  },
  {
    id: 'travel-3',
    category: 'travel',
    categoryLabel: '여행 & 힐링',
    situationTag: '데이트 후반부 / 애프터 빌드업',
    question: '“날씨 슬슬 풀리면 가볍게 당일치기나 1박 2일로 가보고 싶은 국내 여행지나 근교 드라이브 코스 있으세요?”',
    contextTip: '자연스럽게 ‘다음 계절이나 날씨 좋은 날’을 상상하게 만들 때',
    whyItWorks: '먼 미래가 아닌 가까운 계절의 근교 여행지는 향후 2~3번째 데이트 약속을 잡을 수 있는 훌륭한 징검다리가 됩니다.',
    followUpExample: '“양평이나 춘천 북한강 뷰 카페요? 거기 가을에 가면 단풍 진짜 예쁜데, 나중에 기회 되면 한번 같이 가봐요!”',
    dangerPoint: '첫 만남에서 너무 성급하게 “이번 주에 바로 가요!”라고 압박하지 마세요.',
  },

  // ==========================================
  // 3. 음식 & 미식 (Food & Dining)
  // ==========================================
  {
    id: 'food-1',
    category: 'food',
    categoryLabel: '음식 & 미식',
    situationTag: '식당에서 메뉴 고를 때',
    question: '“혹시 못 드시거나 알레르기 있는 음식 있으세요? 평소에 한식·일식·양식 중에 뭐가 제일 손이 자주 가세요?”',
    contextTip: '메뉴판을 펼치자마자 1순위로 건네야 할 필수 질문',
    whyItWorks: '세심한 배려심을 확실하게 각인시키며, 상대방의 식성을 파악해 메뉴 실패 확률을 0%로 줄여줍니다.',
    followUpExample: '“오, 매운 건 잘 못 드시는군요! 그럼 이 파스타는 맵기 조절 가능하니까 덜 맵게 해달라고 말씀드릴게요 :)”',
    dangerPoint: '“아무거나 다 좋아요”라고 해놓고 본인 혼자 마음대로 메뉴를 3개 시켜버리는 실수 주의.',
  },
  {
    id: 'food-2',
    category: 'food',
    categoryLabel: '음식 & 미식',
    situationTag: '식사 도중 음식 한 입 먹고 나서',
    question: '“혹시 스트레스받거나 진짜 기분 꿀꿀할 때 무조건 생각나는 ‘최애 소울푸드’가 있으세요?”',
    contextTip: '맛있게 음식을 먹으며 텐션을 끌어올릴 때',
    whyItWorks: '소울푸드는 단순한 음식이 아니라 개인의 정서와 추억이 담겨 있어 이야기할 때 표정이 한층 밝아집니다.',
    followUpExample: '“엽떡에 허니콤보요? 와 ㅋㅋㅋ 역시 배운 사람이시네요! 엽떡 시키면 떡파세요 오뎅파세요?”',
    dangerPoint: '“그런 정크푸드 몸에 안 좋은데” 같은 훈계는 절대 금기입니다.',
  },
  {
    id: 'food-3',
    category: 'food',
    categoryLabel: '음식 & 미식',
    situationTag: '식사 마무리 / 디저트 갈 때',
    question: '“혹시 네이버 지도나 카카오맵에 가보고 싶어서 별표(저장) 찍어둔 맛집이나 디저트 빵집 있으세요?”',
    contextTip: '자연스럽게 상대방의 지도 속 위시리스트를 공유받을 때',
    whyItWorks: '상대방이 진짜 가고 싶었던 장소를 파악할 수 있어, 2차 카페나 다음 애프터 장소로 연결하기 가장 쉽습니다.',
    followUpExample: '“성수에 소금빵 진짜 유명한 곳이요? 저도 빵지순례 완전 좋아하는데, 오늘 저녁 먹고 거기로 디저트 갈까요?”',
    dangerPoint: '상대방이 말한 곳을 “거기 생각보다 별로던데요?”라고 깎아내리지 마세요.',
  },

  // ==========================================
  // 4. 영화 & 콘텐츠 (Movies, OTT & Culture)
  // ==========================================
  {
    id: 'movie-1',
    category: 'movie',
    categoryLabel: '영화 & 콘텐츠',
    situationTag: '카페에서 차분히 대화할 때',
    question: '“최근에 넷플릭스나 영화관에서 시간 가는 줄 모르고 몰입해서 본 인생 드라마나 영화 있으세요?”',
    contextTip: '공통의 문화 콘텐츠를 통해 가치관과 취향을 맞출 때',
    whyItWorks: '요즘 2030 세대에게 OTT 시리즈나 영화는 가장 보편적이고 진입장벽이 낮은 공감대 형성 소재입니다.',
    followUpExample: '“<눈물의 여왕> 보셨어요? 저도 그 장면에서 눈물 찔끔 흘렸는데 ㅋㅋㅋ 김수현 연기 진짜 대박이지 않았나요?”',
    dangerPoint: '스포일러를 먼저 터뜨리거나 예술 영화 기준을 들이대며 영화학자처럼 분석하지 마세요.',
  },
  {
    id: 'movie-2',
    category: 'movie',
    categoryLabel: '영화 & 콘텐츠',
    situationTag: '웃음 유발 & 가벼운 아이스브레이킹',
    question: '“영화 장르 중에서 공포영화나 스릴러 잘 보세요, 아니면 무서운 거 절대 못 보는 쫄보파세요? ㅋㅋㅋ”',
    contextTip: '가볍게 장난치며 친밀도를 높일 때',
    whyItWorks: '겁이 많다는 고백은 인간적인 귀여움을 어필하고, 둘 다 잘 보거나 못 보는 공통점을 찾기 좋습니다.',
    followUpExample: '“저도 귀신 나오는 건 눈 가리고 소리만 들어요 ㅋㅋㅋ 그럼 팝콘 날릴 일은 없겠네요!”',
    dangerPoint: '상대방이 무서운 걸 못 본다고 해서 놀리거나 얕보는 뉘앙스는 피하세요.',
  },
  {
    id: 'movie-3',
    category: 'movie',
    categoryLabel: '영화 & 콘텐츠',
    situationTag: '음악이나 유튜브 이야기할 때',
    question: '“평소에 유튜브 알고리즘에 제일 자주 뜨는 영상이나 밥 먹을 때 꼭 켜두는 채널이 있으세요?”',
    contextTip: '요즘 유튜브 시청 습관으로 웃긴 취향 공유할 때',
    whyItWorks: '유튜브 알고리즘은 그 사람의 요즘 관심사를 가장 솔직하고 유쾌하게 보여주는 거울입니다.',
    followUpExample: '“강아지/고양이 숏츠요? 와, 동물 채널 한번 보기 시작하면 1시간 순삭이죠! 혹시 반려동물 키우고 싶으세요?”',
    dangerPoint: '정치 시사나 자극적인 렉카 유튜버 이야기는 절대 꺼내지 마세요.',
  },

  // ==========================================
  // 5. 최근 관심사 & 일상 트렌드 (Recent Trends & Daily Life)
  // ==========================================
  {
    id: 'trend-1',
    category: 'trend',
    categoryLabel: '최근 관심사 & 일상',
    situationTag: '일상적인 스몰토크 시',
    question: '“최근에 ‘아 이거 진짜 잘 샀다!’ 하고 삶의 질 수직 상승한 소소한 소비 아이템 있으세요?”',
    contextTip: '자연스러운 라이프스타일 꿀템 이야기로 대화 열기',
    whyItWorks: '물건 이야기는 사생활 침해 느낌이 전혀 없으면서도, 상대방이 가치 있게 여기는 일상 편의를 알 수 있습니다.',
    followUpExample: '“노이즈 캔슬링 이어폰이요? 지하철 탈 때 신세계 열리죠! 퇴근길에 주로 어떤 음악 들으세요?”',
    dangerPoint: '명품이나 고가 자동차 등 재력을 과시하거나 평가하는 분위기로 흐르지 않게 주의하세요.',
  },
  {
    id: 'trend-2',
    category: 'trend',
    categoryLabel: '최근 관심사 & 일상',
    situationTag: '웃음이 필요할 때',
    question: '“요즘 퇴근하고 집 가면 제일 먼저 뭐 하세요? 손 씻고 바로 침대로 다이빙인가요? ㅋㅋㅋ”',
    contextTip: '직장인/학생의 공감대를 자극해 긴장을 풀 때',
    whyItWorks: '퇴근 후 지친 일상에 대한 솔직한 공감은 서로를 편안한 ‘내 편’으로 느끼게 만듭니다.',
    followUpExample: '“손 씻고 편한 잠옷 갈아입고 에어컨(보일러) 켜는 순간이 하루 중 제일 행복하죠 ㅠㅠ”',
    dangerPoint: '회사나 상사에 대한 과도한 한탄이나 욕설, 징징거림으로 대화가 어두워지지 않도록 하세요.',
  },
  {
    id: 'trend-3',
    category: 'trend',
    categoryLabel: '최근 관심사 & 일상',
    situationTag: '대화가 깊어지는 중후반부',
    question: '“만약 올 한 해가 지나기 전에 꼭 하나 달성해보고 싶은 소소한 버킷리스트가 있으시다면 어떤 거예요?”',
    contextTip: '긍정적인 에너지와 앞으로의 계획을 나눌 때',
    whyItWorks: '목표와 버킷리스트를 나눌 때 상대방의 삶에 대한 열정과 가치관을 엿볼 수 있습니다.',
    followUpExample: '“베이킹 마스터하기요? 와, 나중에 빵 구우시면 저한테 1등으로 시식 기회 주셔야 돼요!”',
    dangerPoint: '“그거 가능하겠어요?” 식의 회의적인 현실주의자 태도는 금지입니다.',
  },

  // ==========================================
  // 6. 상황별 아이스브레이킹 & 정적 탈출 (Situational Icebreakers)
  // ==========================================
  {
    id: 'ice-meet',
    category: 'icebreaker',
    categoryLabel: '상황별 아이스브레이킹',
    situationTag: '만난 직후 1~2분 (인사)',
    question: '“오늘 약속 장소 오실 때 길 안 헷갈리셨어요? 날씨가 생각보다 따뜻해서(선선해서) 다행이에요!”',
    contextTip: '어색한 첫 3초 침묵을 깨는 가장 무난하고 안전한 오프너',
    whyItWorks: '오면서 겪은 사소한 이동 과정과 날씨는 누구나 뇌 용량을 쓰지 않고 편안하게 웃으며 답할 수 있습니다.',
    followUpExample: '“지하철 2호선 타고 오셨군요! 저도 그쪽 자주 가는데 오늘 사람 별로 없었나요?”',
    dangerPoint: '상대방 외모에 대한 과도한 품평(“화장이 진하시네요” 등)은 절대 금물입니다.',
  },
  {
    id: 'ice-walk',
    category: 'icebreaker',
    categoryLabel: '상황별 아이스브레이킹',
    situationTag: '식당에서 카페로 길 걸을 때',
    question: '“제가 걸음이 좀 빠른 편인가요? 혹시 신발 불편하시진 않으세요? 편하게 말씀해주세요!”',
    contextTip: '나란히 걸어갈 때 정적을 방지하고 배려심을 전달하는 순간',
    whyItWorks: '나란히 걸을 때는 마주 볼 때보다 눈 맞춤 부담이 적으며, 상대방의 보폭과 컨디션을 챙기는 모습이 큰 호감을 줍니다.',
    followUpExample: '“괜찮으시다니 다행이에요. 저기 골목에 예쁜 카페 하나 봐둔 곳 있는데 저쪽으로 가볼까요?”',
    dangerPoint: '앞서서 혼자 쌩쌩 걸어가지 마세요.',
  },
  {
    id: 'ice-silence',
    category: 'icebreaker',
    categoryLabel: '상황별 아이스브레이킹',
    situationTag: '🚨 갑자기 10초 이상 정적이 흘렀을 때',
    question: '“앗, 제가 사실 오늘 OOO 씨 뵙는다고 해서 어제부터 꽤 긴장했거든요. 혹시 OOO 씨도 오늘 나오실 때 떨리셨어요? ㅎㅎ”',
    contextTip: '어색한 정적이 찾아와 당황스러울 때',
    whyItWorks: '침묵을 억지로 때우려 하지 않고, ‘솔직한 긴장감’을 인정하면 상대방도 안도하며 동질감과 친밀감을 느끼게 됩니다.',
    followUpExample: '“저도 옷 고르느라 3번 갈아입었어요 ㅋㅋㅋ 그래도 OOO 씨가 편하게 말씀해주셔서 지금은 긴장 많이 풀렸어요!”',
    dangerPoint: '휴대폰을 꺼내 시계를 보거나 허둥지둥 두리번거리지 마세요.',
  },

  // ==========================================
  // 7. ⚠️ 절대 피해야 할 금기 질문 (Taboo Questions)
  // ==========================================
  {
    id: 'taboo-ex',
    category: 'taboo',
    categoryLabel: '⚠️ 절대 피해야 할 금기 질문',
    situationTag: '전 연인 / 과거 연애사 캐묻기',
    question: '“이전에 만나셨던 분이랑은 왜 헤어지셨어요? 마지막 연애는 언제예요?”',
    contextTip: '호기심이나 어색함을 채우려고 던지기 쉬운 최악의 질문',
    whyItWorks: '과거의 상처와 부정적인 감정을 소환하며, 상대를 평가질하는 듯한 불쾌감과 경계심을 급상승시킵니다.',
    followUpExample: '대체 질문: “평소에 어떤 성향의 사람과 대화할 때 마음이 편안하세요?”로 건강하게 물어보세요.',
    isTaboo: true,
  },
  {
    id: 'taboo-interview',
    category: 'taboo',
    categoryLabel: '⚠️ 절대 피해야 할 금기 질문',
    situationTag: '호구조사 & 재산/연봉 취조',
    question: '“회사 연봉이나 인센티브는 어느 정도 나와요? 자취방은 전세인가요 자가인가요?”',
    contextTip: '마치 면접관처럼 조건을 따져 묻는 치명적 실수',
    whyItWorks: '인간 대 인간의 감정적 교감이 아닌 ‘조건 쇼핑’을 당하는 모욕감을 주며, 두 번 다시 만나고 싶지 않게 만듭니다.',
    followUpExample: '대체 질문: “요즘 회사 업무는 적성에 잘 맞으세요? 퇴근 후엔 어떻게 에너지 충전하세요?”',
    isTaboo: true,
  },
  {
    id: 'taboo-debate',
    category: 'taboo',
    categoryLabel: '⚠️ 절대 피해야 할 금기 질문',
    situationTag: '정치·종교·민감한 사회 이슈 논쟁',
    question: '“정치 성향이나 종교가 어떻게 되세요? OOO 뉴스 사건에 대해 어떻게 생각하세요?”',
    contextTip: '친밀감이 쌓이기 전 가치관 논쟁을 벌이는 위험한 주제',
    whyItWorks: '소개팅은 토론 배틀이 아닙니다. 의견 차이가 생기면 바로 분위기가 싸늘해지고 회복이 불가능합니다.',
    followUpExample: '대체 질문: 음식, 여행, 취미, 영화 등 즐겁고 밝은 공통분모부터 탄탄히 쌓으세요.',
    isTaboo: true,
  },
];
