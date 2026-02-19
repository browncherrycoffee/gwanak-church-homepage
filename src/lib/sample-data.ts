import type { ContentEntry } from "@/types";

export const sampleContents: ContentEntry[] = [
  // 새벽기도
  {
    id: "dawn-1",
    category: "dawn-prayer",
    title: "하나님의 약속을 붙잡는 믿음",
    date: "2026-02-17",
    youtubeUrl: "",
    youtubeVideoId: "",
    scriptureReference: "히브리서 11:1-6",
    content:
      "믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거입니다. 하나님께서 약속하신 것을 굳게 붙잡고, 흔들리지 않는 믿음으로 새벽을 열어가는 성도가 됩시다.",
    preacher: "김성현 목사",
    createdAt: "2026-02-17T05:00:00.000Z",
    updatedAt: "2026-02-17T05:00:00.000Z",
  },
  {
    id: "dawn-2",
    category: "dawn-prayer",
    title: "기도의 능력",
    date: "2026-02-18",
    youtubeUrl: "",
    youtubeVideoId: "",
    scriptureReference: "야고보서 5:16-18",
    content:
      "의인의 간구는 역사하는 힘이 큽니다. 엘리야도 우리와 같은 성정을 가진 사람이었으나, 간절히 기도하매 하늘이 비를 주었습니다. 기도로 시작하는 아침이 하루를 변화시킵니다.",
    preacher: "김성현 목사",
    createdAt: "2026-02-18T05:00:00.000Z",
    updatedAt: "2026-02-18T05:00:00.000Z",
  },
  {
    id: "dawn-3",
    category: "dawn-prayer",
    title: "감사로 드리는 예배",
    date: "2026-02-19",
    youtubeUrl: "",
    youtubeVideoId: "",
    scriptureReference: "시편 100:1-5",
    content:
      "감사함으로 그의 문에 들어가며 찬송함으로 그의 궁정에 들어가라. 그에게 감사하며 그의 이름을 송축할지어다.",
    preacher: "김성현 목사",
    createdAt: "2026-02-19T05:00:00.000Z",
    updatedAt: "2026-02-19T05:00:00.000Z",
  },

  // 주일설교
  {
    id: "sermon-1",
    category: "sunday-sermon",
    title: "그리스도 안에서의 새로운 삶",
    date: "2026-02-15",
    youtubeUrl: "",
    youtubeVideoId: "",
    scriptureReference: "고린도후서 5:17-21",
    content:
      "누구든지 그리스도 안에 있으면 새로운 피조물이라. 이전 것은 지나갔으니 보라 새 것이 되었도다. 우리는 그리스도의 대사로서 이 땅에서 화목의 직분을 감당해야 합니다.",
    preacher: "김성현 목사",
    createdAt: "2026-02-15T10:00:00.000Z",
    updatedAt: "2026-02-15T10:00:00.000Z",
  },
  {
    id: "sermon-2",
    category: "sunday-sermon",
    title: "하나님 나라의 백성으로 사는 법",
    date: "2026-02-08",
    youtubeUrl: "",
    youtubeVideoId: "",
    scriptureReference: "마태복음 5:1-12",
    content:
      "산상수훈은 하나님 나라의 헌법입니다. 심령이 가난한 자, 애통하는 자, 온유한 자가 복이 있나니, 이것은 세상의 가치와는 정반대되는 하나님 나라의 원리입니다.",
    preacher: "김성현 목사",
    createdAt: "2026-02-08T10:00:00.000Z",
    updatedAt: "2026-02-08T10:00:00.000Z",
  },
  {
    id: "sermon-3",
    category: "sunday-sermon",
    title: "십자가와 부활의 복음",
    date: "2026-02-01",
    youtubeUrl: "",
    youtubeVideoId: "",
    scriptureReference: "고린도전서 15:1-11",
    content:
      "내가 받은 것을 먼저 너희에게 전하였노니 이는 성경대로 그리스도께서 우리 죄를 위하여 죽으시고, 장사 지낸 바 되셨다가 성경대로 사흘 만에 다시 살아나셨다는 것입니다.",
    preacher: "김성현 목사",
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-01T10:00:00.000Z",
  },

  // 교리문답
  {
    id: "catechism-1",
    category: "catechism",
    title: "하이델베르크 교리문답 제1문",
    date: "2026-02-15",
    youtubeUrl: "",
    youtubeVideoId: "",
    scriptureReference: "로마서 14:7-9",
    content:
      "문: 살아서나 죽어서나 당신의 유일한 위로는 무엇입니까?\n답: 살아서나 죽어서나 나는 나의 것이 아니요, 몸도 영혼도 나의 신실하신 구주 예수 그리스도의 것입니다.",
    preacher: "김성현 목사",
    createdAt: "2026-02-15T19:00:00.000Z",
    updatedAt: "2026-02-15T19:00:00.000Z",
  },
  {
    id: "catechism-2",
    category: "catechism",
    title: "하이델베르크 교리문답 제2문",
    date: "2026-02-08",
    youtubeUrl: "",
    youtubeVideoId: "",
    scriptureReference: "마태복음 22:37-40",
    content:
      "문: 이 위로 가운데 행복하게 살고 죽기 위하여 당신이 알아야 할 것은 몇 가지입니까?\n답: 세 가지입니다. 첫째는 나의 죄와 비참함이 얼마나 큰가 하는 것이요, 둘째는 어떻게 나의 모든 죄와 비참함에서 구원받는가 하는 것이요, 셋째는 이 구원에 대해 어떻게 하나님께 감사해야 하는가 하는 것입니다.",
    preacher: "김성현 목사",
    createdAt: "2026-02-08T19:00:00.000Z",
    updatedAt: "2026-02-08T19:00:00.000Z",
  },
];
