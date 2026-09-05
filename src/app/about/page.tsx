"use client";

import { Cross, BookOpenText, TreeStructure, Clock, Church, Scroll, NavigationArrow, Phone, Envelope, HandsPraying } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG } from "@/lib/constants";

const HISTORY = [
  { year: "2009", events: ["5. 17. 유해신 목사 인도로 첫 예배 (관악구 봉천동 '좋은교사' 사무실, 3가정 6명의 성도)", "10. 25. 종교개혁 기념주일 연합예배 (의왕교회)"] },
  { year: "2010", events: ["1. 17. 정기 공동의회", "5. 8. 서울광염교회 제74호 개척교회로 결정, 예배당 이전 감사예배 (관악구 신림동 247-2, 3층)"] },
  { year: "2011", events: ["4. 11. 김재윤 부목사 부임", "5. 29. 설립기념예배 (주관: 경기노회 남부시찰)", "10. 23. 종교개혁 기념주일 특강 \"오직 믿음\" (김재윤 교수)"] },
  { year: "2012", events: ["4. 1. 일본 자매교회 신학생 방문 (총 7명)", "8. 15-17. 전교인 하계 수련회", "12. 22-23. 성탄기념 말씀집회 \"교회의 직분과 그리스도의 오심\" (강사: 김헌수 교수)"] },
  { year: "2013", events: ["4. 14. 임시 공동의회: 교회 명칭 변경 ('좋은교회'에서 '관악교회'로)", "6. 23. 특강 \"웨스트민스터 신앙고백의 특징들\" (김재윤 교수)"] },
  { year: "2014", events: ["5. 18. 설립 5주년 기념주일", "9. 21. 캐나다 자매교회 대표단 방문 (안톤 수만 목사, 존 반더스툽 장로)", "10. 19. 일본 자매교회 대표단 방문 (사카모토 노리오 목사 외 10명)"] },
  { year: "2015", events: ["5. 10. 초청 설교 및 특강 (바런트 캄파위스 교수)", "10. 18. 호주 및 인도네시아 자매교회 대표단 방문 / 종교개혁 기념 초청설교 (로우랜드 워드 목사)"] },
  { year: "2016", events: ["1. 31. 임일택, 조용준, 정재용 서리집사 임명", "6. 5. 초청 설교 (김헌수 교수)", "12. 18. 김정권 장로 취임"] },
  { year: "2017", events: ["3. 5. 특강 \"3.1운동과 기독교의 역사의식\" (강사: 이만열 교수)", "7. 30. 일본 자매교회 성도 방문", "9. 17. 캐나다 자매교회 대표단 방문", "9. 24. 네덜란드 자매교회 대표단 방문"] },
  { year: "2018", events: ["5. 27. 유해신 목사 위임 (주관: 서울서부노회)", "10. 9. 종교개혁 기념 연합수련회 \"개혁신앙인의 삶\" (강사: 김재윤 교수)"] },
  { year: "2019", events: ["4. 22. 김재윤 부목사 사임 (고려신학대학원 기관목사로)", "10. 9-10. 종교개혁 기념 연합수련회 \"포스트모던 시대 개혁교회의 나아갈 방향\" (강사: 권수경 교수)"] },
  { year: "2020", events: ["1. 12. 신년 말씀사경회 (강사: 정근두 목사)", "10. 11. 종교개혁 기념 초청 설교 및 특강 \"고대 교회건물에 나타난 기독교 신앙\" (강사: 이충만 교수)"] },
  { year: "2021", events: ["1. 3. 정재용 전도사 부임", "3. 7. 임일택, 조용준 장로 임직", "12. 26. 김정권 장로 은퇴 (34년 간 장로사역)"] },
  { year: "2022", events: ["2. 27. 중고등부 SFC 조직", "3. 6. 안용준 전도사 부임", "6. 26. 남녀 전도회 조직", "11. 13. 종교개혁 기념 초청 설교 및 특강 \"루터의 십자가 신학과 코람데오\" (강사: 유해무 교수)"] },
  { year: "2023", events: ["4. 10. 정재용 강도사 인허", "9. 17. 초청 설교 및 특강 \"캐나다 개혁교회와 자녀 신앙교육\" (강사: 마크 야흐트 목사)", "10. 8-9. 전교인 수양회 \"기뻐하라\" (강화 성산청소년수련원)"] },
  { year: "2024", events: ["4. 15. 안용준 목사 임직 (SFC 기관목사로 관악교회 청년부 담당)", "5. 5-6. 전교인 수양회 \"하나님 안에서 누리는 참 행복\" (강사: 김성수 교수)", "11. 24. 안효상, 차승회 장로 임직"] },
] as const;

interface WorshipItem {
  title: string;
  time: string;
  note: string;
  highlight?: boolean;
}

const WORSHIP_ITEMS: WorshipItem[] = [
  { title: "주일 오전 예배", time: "매 주일 오전 11시", note: "교회당", highlight: true },
  { title: "주일 오후 성경공부와 친교", time: "오후 1시", note: "첫째/셋째/다섯째주 교리공부, 둘째주 나눔조모임, 넷째주 부서모임" },
  { title: "새벽기도회", time: "월~금 오전 6시, 토 오전 7시", note: "교회당 · 유튜브" },
  { title: "금요기도회", time: "매주 금요일 저녁 8시", note: "교회당 · 유튜브" },
  { title: "수요 노방전도", time: "매주 수요일 오전 11시 40분", note: "교회당 인근" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">교회 소개</h1>
      <p className="text-muted-foreground mb-5">
        {SITE_CONFIG.denomination} {SITE_CONFIG.name}
      </p>

      {/* 빠른 이동 */}
      <nav className="sticky top-14 z-40 -mx-4 px-4 py-2 bg-background/90 backdrop-blur border-b mb-6 flex gap-2 overflow-x-auto">
        {[
          { label: "예배 안내", href: "#worship" },
          { label: "교회 소개", href: "#about" },
          { label: "세워가는 교회", href: "#principles" },
          { label: "예배 신학", href: "#liturgy" },
          { label: "신앙고백", href: "#confession" },
          { label: "교회 연혁", href: "#history" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* 처음 오신 분 환영 */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 mb-6">
        <p className="text-base font-semibold mb-1.5">처음 오신 분들을 환영합니다</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          관악교회는 하나님의 말씀을 중심으로 함께 예배하고, 서로 교제하며, 지역 이웃을 섬기는 공동체입니다.
          언제든지 주일 오전 11시 예배에 오셔서 저희와 함께 예배드리시기를 진심으로 권합니다.
          궁금한 점은 전화나 이메일로 편하게 문의해 주세요.
        </p>
      </div>

      {/* 예배 안내 — 가장 먼저, 가장 크게 */}
      <Card id="worship" className="mb-6 border-primary/30 bg-secondary/40 scroll-mt-28">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Church weight="fill" className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">예배 및 모임 안내</h2>
          </div>

          <div className="space-y-3 mb-6">
            {WORSHIP_ITEMS.map((item) => (
              <div
                key={item.title}
                className={`rounded-xl border p-4 ${item.highlight ? "border-primary/40 bg-primary/5" : "border-border bg-background"}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h4 className={`font-semibold ${item.highlight ? "text-primary text-base" : "text-base"}`}>{item.title}</h4>
                  <span className={`font-bold ${item.highlight ? "text-primary text-lg" : "text-base font-semibold"}`}>{item.time}</span>
                </div>
                {item.note && (
                  <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                )}
              </div>
            ))}
          </div>

          {/* 위치 + 연락처 */}
          <div className="rounded-xl border bg-background p-4 space-y-3">
            <div className="flex items-start gap-3">
              <NavigationArrow weight="light" className="h-5 w-5 shrink-0 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-0.5">교회 위치</p>
                <p className="text-base text-foreground/90 break-keep">{SITE_CONFIG.address}</p>
                <a
                  href="https://map.kakao.com/?q=서울+관악구+대학길+52"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1.5 text-sm font-medium text-primary hover:underline"
                >
                  카카오맵으로 보기 →
                </a>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Phone weight="light" className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium mb-0.5">전화</p>
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="text-lg font-bold text-primary hover:underline tracking-wide"
                >
                  {SITE_CONFIG.phone}
                </a>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Envelope weight="light" className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium mb-0.5">이메일</p>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-base text-primary hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* 교회 소개 */}
      <Card id="about" className="mb-6 scroll-mt-28">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Cross weight="light" className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">관악교회</h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-foreground/90">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-primary mb-1">교회의 비전</p>
              <p className="text-base font-semibold mb-2">왕 같은 제사장들로 세워져가는 관악교회</p>
              <p className="italic text-muted-foreground text-sm leading-relaxed">
                &ldquo;너희는 택하신 족속이요 왕 같은 제사장들이요 거룩한 나라요 그의 소유가 된 백성이니
                이는 너희를 어두운 데서 불러 내어 그의 기이한 빛에 들어가게 하신 자의 아름다운 덕을
                선전하게 하려 하심이라&rdquo;
                <span className="block mt-1 not-italic text-xs font-medium">— 베드로전서 2장 9절</span>
              </p>
            </div>
            <p>
              관악교회는 사도신경과 니케아 신조, 개혁-장로교 전통의 웨스트민스터 고백서들과
              하이델베르크 요리문답을 성경을 이해하는 좋은 나침반으로 삼고 있습니다.
              신앙고백서의 안내를 받으며 하나님의 말씀에 따라 교회를 세워가려 합니다.
            </p>
            <p>
              2009년 5월 17일, 유해신 목사 인도로 관악구 봉천동에서 3가정 6명의 성도가
              첫 예배를 드리며 시작된 관악교회(당시 좋은교회)는, 하나님의 말씀에 순종하여
              구원의 은혜를 받고, 온 세상에 하나님 나라를 세워 가는 교회로 성장해 왔습니다.
            </p>
            <p className="text-xs text-muted-foreground pt-2 border-t">
              아래 내용은 <strong className="text-foreground/80">관악교회 소개책자(제3판, 2016년 5월 1일 발행)</strong>에
              담긴 글을 바탕으로 정리한 것입니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 교회를 세우는 7가지 원리 — 소개책자 전문 */}
      <Card id="principles" className="mb-6 scroll-mt-28">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Church weight="light" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">관악교회가 세워가는 교회</h2>
              <p className="text-xs text-muted-foreground mt-0.5">소개책자에 기록된 일곱 가지 지향</p>
            </div>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-foreground/90">
            {/* 원리 1 */}
            <div>
              <h3 className="font-bold text-base mb-2 text-primary">
                1. 교회에 주신 하나님의 말씀에 순종하는 교회
              </h3>
              <p className="text-sm text-foreground/85 leading-relaxed break-keep">
                하나님은 그리스도의 십자가 복음 말씀과 성령님을 통해 믿는 자들을 구원하셔서
                하나이고 거룩하고 보편적이고 사도적인 교회(OHCA: One Holy Catholic Apostolic)를
                세워 주셨습니다. 교회는 하나님 말씀에 순종하여 구원의 은혜를 받고,
                온 세상에 하나님 나라를 세워 갑니다.
              </p>
            </div>

            {/* 원리 2 */}
            <div>
              <h3 className="font-bold text-base mb-2 text-primary">
                2. 교회의 회원과 직분자를 바로 세우는 교회
              </h3>
              <div className="space-y-2 text-sm text-foreground/85 leading-relaxed break-keep">
                <p>
                  관악교회는 말씀과 바른 예배를 통해 한 명 한 명의 교인들을 믿음으로 세우고
                  일상에서 그리스도의 다스림을 받는 왕 같은 제사장으로 양육함으로써 바른 교회를
                  이루려 합니다. 고백서를 통해 하나님 말씀을 풍성히 배우면서 믿음이 분명한
                  사람에게 세례를 주어 정회원으로 받아들입니다.
                </p>
                <p>
                  하나님은 직분자를 교회에 선물로 주셔서 성도에게 은혜를 공급하십니다.
                  복음을 신실하게 전하여 주님의 백성이 예배를 통해 은혜 받도록 하는 <strong>목사</strong>,
                  성도들의 일상의 삶에서 하나님 나라 백성으로 살아가게 격려하는 <strong>장로</strong>,
                  예배와 삶에 필요한 지원을 잘 하는 <strong>집사</strong> —
                  눈물과 희생으로 섬기는 직분자를 잘 세워 나갈 것입니다.
                </p>
              </div>
            </div>

            {/* 원리 3 */}
            <div>
              <h3 className="font-bold text-base mb-2 text-primary">
                3. 예배에서 은혜 받고 헌신하는 교회
              </h3>
              <p className="text-sm text-foreground/85 leading-relaxed break-keep mb-3">
                예배를 통해 은혜를 받고 주님께 더욱 헌신하는 인격으로 성장합니다.
                성령 안에서 지성, 의지, 감정을 포괄하는 전인격으로 예배 드리면서 교회는
                거룩하고 영광스러운 그리스도의 형상으로 변화되어 갑니다. 예배의 힘으로
                일상에서 하나님 나라의 백성으로 살아갑니다.
              </p>
              <div className="space-y-3 pl-3 border-l-2 border-primary/20">
                <div>
                  <p className="text-sm font-semibold mb-1">1) 말씀으로 은혜 주심</p>
                  <p className="text-sm text-foreground/80 leading-relaxed break-keep">
                    주님은 말씀과 성례를 통해 십자가의 구원의 은혜를 성도들에게 실제적으로
                    계속 공급해 주십니다. 관악교회는 성령께서 지금도 성경을 통해 말씀하시는 바를
                    기도하면서 받습니다. 현대의 경건한 주석가들뿐 아니라 어거스틴·크리소스톰·
                    토마스 아퀴나스·존 칼빈 등의 가르침을 통해 배우면서 설교를 준비합니다.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">2) 성례(세례와 성찬)로 은혜 주심</p>
                  <p className="text-sm text-foreground/80 leading-relaxed break-keep mb-2">
                    성례는 부활하신 주님께서 교회를 통해 은혜를 주시는 한 방법입니다.
                    평범한 물과 빵, 포도주를 사용하여 성찬을 시행할 때 주님은 영으로
                    함께 임재해 계십니다.
                  </p>
                  <p className="text-xs text-foreground/75 leading-relaxed break-keep">
                    <strong>세례</strong> — 예수님을 믿은 사람들이 그 믿음을 고백하고 세례를 받을 때
                    주님은 믿음과 순종을 더해 주십니다. 믿는 자의 자녀들도 언약백성으로 삼으시겠다는
                    약속이 있기에 어린이들에게도 세례를 줍니다.
                  </p>
                  <p className="text-xs text-foreground/75 leading-relaxed break-keep mt-1">
                    <strong>성찬</strong> — 주님의 이름으로 직분자들이 빵과 포도주를 나눠줄 때
                    주님은 죄 사함, 새로운 생명, 거룩하게 변화되는 능력을 공급해 주십니다.
                    지금은 한 달에 한 번 성찬을 하지만 앞으로 매 주일 하는 것을 목표로 하고 있습니다.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">3) 기도를 통해 은혜 주심</p>
                  <p className="text-sm text-foreground/80 leading-relaxed break-keep">
                    자신과 교회와 세상의 죄를 고백하고 고통을 쏟아 놓을 때 하나님은
                    용서하시고 치료해 주십니다. 영적이고 물질적인 필요를 간구할 때
                    풍성히 공급해 주십니다.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">4) 찬양과 헌금으로 드림</p>
                  <p className="text-sm text-foreground/80 leading-relaxed break-keep">
                    하나님의 위대하심을 찬양하고 우리의 새로운 헌신을 고백합니다.
                    헌금통 대신 예배 시간 중에 헌금 바구니에 직접 넣으면서 우리의 마음을
                    하나님께 올려 드리는 영적 체험을 합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 원리 4 */}
            <div>
              <h3 className="font-bold text-base mb-2 text-primary">
                4. 예배, 성경공부, 나눔을 통해 함께 성장하는 교회
              </h3>
              <div className="space-y-3 pl-3 border-l-2 border-primary/20">
                <div>
                  <p className="text-sm font-semibold mb-1">1) 예배를 통한 교제</p>
                  <p className="text-sm text-foreground/80 leading-relaxed break-keep">
                    삼위일체 한 분 하나님께 예배할 때 교회는 서로를 성숙시키는 깊은 교제를 나눕니다.
                    머리이신 예수 그리스도께서 구원의 은혜를 베풀어주시고 몸인 교회가 순종으로
                    화답하는 것을 함께 배웁니다.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">2) 성경공부 — 하이델베르크 요리문답</p>
                  <p className="text-sm text-foreground/80 leading-relaxed break-keep">
                    위로가 넘치는 표현으로 성경을 잘 요약한 하이델베르크 요리문답으로 성경을 배우며
                    교회가 같은 신앙고백으로 하나되어 갑니다. 우리가 속한 장로교회가 공식적으로
                    받아들이는 웨스트민스터 문서는 세례교인 공부에 사용합니다.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">3) 기도회 — 주일 저녁예배와 수요 기도회</p>
                  <p className="text-sm text-foreground/80 leading-relaxed break-keep">
                    주일 저녁에 하나님의 이름을 부르고 함께 기도하며 주님 안에서 하루를 마무리합니다.
                    수요일 저녁에도 말씀을 듣고 위로를 얻으며 교회와 개인의 필요를 위해
                    함께 기도하는 시간을 가집니다.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">4) 남성·여성·청년 모임</p>
                  <p className="text-sm text-foreground/80 leading-relaxed break-keep">
                    주일 오후에 한 달에 한 번씩 그룹별 모임을 합니다. 가정에서 남편과 아내,
                    부모로서 자신의 직분을 충실히 감당할 수 있도록 서로 위로하고 권면하며
                    기도합니다. 청년들은 장차 좋은 남편과 아내로 준비될 수 있도록
                    가정의 모습을 배웁니다.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">5) 주일학교 성경공부</p>
                  <p className="text-sm text-foreground/80 leading-relaxed break-keep">
                    유치부와 유년부 학생들은 목사와 함께 요리문답을 배우며 기본 가르침을
                    마음에 새깁니다. 중고등부는 주일 예배와 성경공부를 복습하고 다음주 예배 본문을
                    예습하며 자립적 신앙인으로 성장해 갑니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 원리 5 */}
            <div>
              <h3 className="font-bold text-base mb-2 text-primary">
                5. 개인적 격려와 공적인 격려로서 권징을 시행하는 교회
              </h3>
              <p className="text-sm text-foreground/85 leading-relaxed break-keep">
                성도들은 서로 개인적으로 가정에 초대하여 축복하고 격려하고 권면해 줍니다.
                교회 차원에서는 목사와 교회의 직분자들이 개인과 가정을 수시로 심방하여
                위로하고 격려하고 권면합니다. 또한 성도들은 평소에 서로를 위해 기도함으로써
                서로를 세워 줍니다.
              </p>
            </div>

            {/* 원리 6 */}
            <div>
              <h3 className="font-bold text-base mb-2 text-primary">
                6. 관계와 참된 예배를 통해 전도하는 교회
              </h3>
              <p className="text-sm text-foreground/85 leading-relaxed break-keep">
                먼저 성도들이 예배를 통해 하나님의 큰 은혜를 받고 일상에서 하나님 나라의
                백성으로 능력 있게 살아갈 때 다른 영혼에 대한 관심이 자연적으로 생깁니다.
                가족, 직장동료, 친구들을 사랑으로 섬기며 좋은 친구가 됩니다. 기회가 닿을
                때마다 자신이 아는 하나님에 대해 말로 증거하고, 사랑의 관계 속에서 교회의
                예배로 초청합니다.
              </p>
            </div>

            {/* 원리 7 */}
            <div>
              <h3 className="font-bold text-base mb-2 text-primary">
                7. 예배의 은혜로 세상을 축복하며 하나님 나라를 세워 가는 성도와 교회
              </h3>
              <p className="text-sm text-foreground/85 leading-relaxed break-keep mb-3">
                관악교회 성도들은 주일 예배에서 받은 은혜를 세상 가운데 나누어 줍니다.
                성도는 말씀과 예배에 순종하는 삶을 통해 가정, 직장, 시민사회에서
                하나님의 복을 전달하는 축복의 근원이 됩니다.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-semibold text-primary mb-1">개인생활</p>
                  <p className="text-xs text-foreground/75 leading-relaxed break-keep">
                    매일 20분 이상씩 개인적 성경읽기와 기도시간을 가지며,
                    성경 통독을 권장합니다.
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-semibold text-primary mb-1">가정생활</p>
                  <p className="text-xs text-foreground/75 leading-relaxed break-keep">
                    주중 하루 저녁 가족 경건회, 아침저녁 함께 찬송과 기도,
                    하나님 이름으로 서로 축복합니다.
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-semibold text-primary mb-1">직장생활</p>
                  <p className="text-xs text-foreground/75 leading-relaxed break-keep">
                    주께 하듯이 사람들을 사랑하고 주어진 일에 최선을 다합니다.
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-semibold text-primary mb-1">시민사회와 국가</p>
                  <p className="text-xs text-foreground/75 leading-relaxed break-keep">
                    지역사회를 섬기고, 공직자를 위해 기도하며, 정직하게 법을 지키고
                    선거 때 투표합니다.
                  </p>
                </div>
                <div className="rounded-lg border p-3 sm:col-span-2">
                  <p className="text-xs font-semibold text-primary mb-1">선교·기독교단체·시민단체 참여</p>
                  <p className="text-xs text-foreground/75 leading-relaxed break-keep">
                    외부의 기관과 단체에 회원으로 활동에 참여하거나 재정으로 후원합니다.
                  </p>
                </div>
              </div>
              <blockquote className="rounded-xl border-l-4 border-primary/50 bg-primary/5 p-4 text-sm leading-relaxed break-keep italic">
                왕같은 제사장인 참 성도는 예배에 받은 말씀으로 세상에서 전도하고,
                세상을 축복합니다. 교회에서 예배를 시작한 성도는 세상에서 예배의 삶으로
                하나님 나라를 확장하고, 교회와 세상이 하나될 영원한 그 나라에서 영광 가운데
                예배하고 일할 것입니다. 삼위 하나님이 말씀으로 오실 때, 겸손히 나아가
                예배하며 은혜받는 교회는 그리스도 안에서 세상의 영원한 희망입니다.
              </blockquote>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* 예배 신학 — 소개책자 예배 순서와 의미 */}
      <Card id="liturgy" className="mb-6 scroll-mt-28 border-primary/20 bg-secondary/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HandsPraying weight="fill" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">예배 — 삼위 하나님이 오시고 교회가 나아가는 교제</h2>
              <p className="text-xs text-muted-foreground mt-0.5">koinonia · 예배의 의미와 순서</p>
            </div>
          </div>

          <div className="space-y-5 text-foreground/90">
            <p className="text-sm leading-relaxed break-keep">
              예배는 하나님께서 우리에게 오셔서 은혜와 기쁨을 주시고 우리는 하나님께 나아가
              찬양과 영광을 올리며 새로운 헌신을 다짐하는 자리입니다. 우리는 하늘의 성도들이
              하늘에 계신 하나님께 드리는 영원한 예배를 모델로 배우고 그 예배에 참여합니다.
              <span className="text-xs text-muted-foreground">(계 5:6~8)</span>
            </p>
            <p className="text-sm leading-relaxed break-keep">
              하늘의 성전을 땅에서 경험하는 교회의 예배는 먼저 성삼위 하나님이 우리에게
              은혜로 다가오셔서 당신을 주시고 말씀과 구원의 은혜를 주심에서 시작됩니다.
              교회는 엎드려 절하면서 삼위 하나님께 나갑니다.
            </p>

            {/* 예배의 네 가지 원리 */}
            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm font-semibold mb-3">예배의 네 가지 원리</p>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex gap-2">
                  <span className="text-primary font-bold shrink-0">1</span>
                  <span className="break-keep">
                    하나님이 우리에게 오심을 받고, 우리는 반응하여 나아갑니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold shrink-0">2</span>
                  <span className="break-keep">
                    일상을 가지고 예배로, 예배를 가지고 일상으로 — 일상을 망각하지 않고,
                    염려 없이 편하게 관조하면서 나갑니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold shrink-0">3</span>
                  <span className="break-keep">성도와 함께 예배를 드립니다.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold shrink-0">4</span>
                  <span className="break-keep">
                    전인격(지성·의지·감정)으로 예배를 드립니다 —
                    고통과 죄의 문제로 통곡하고, 주신 은혜를 마음껏 노래합니다.
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-sm leading-relaxed break-keep">
              예배의 순서는 <strong className="text-primary">하나님의 나아오심(↓)</strong>과
              <strong className="text-primary"> 우리가 하나님께 나아감(↑)</strong>이 반복되면서
              네 번 내지 다섯 번의 만남의 사이클이 이루어집니다.
            </p>

            {/* 예배 순서 5단계 */}
            <div className="space-y-4">
              {/* 1단계 */}
              <div className="rounded-xl border bg-background p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                  <h4 className="font-bold text-base">하나님께 나아감</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3 break-keep">
                  세상의 삶의 자리에서 하나님이 계신 영적 공간으로 들어 옵니다.
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↓</span>초대
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      삼위 하나님이 우리에게 나아 오셔서 영적 잔치로 초대해 주십니다.
                      &ldquo;수고하고 무거운 짐진 자들아 다 내게로 오라. 내가 너희를 쉬게 하리라.&rdquo;
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/60 border p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↑</span>송영
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      하나님의 초대에 대해 우리는 송영, 즉 하나님의 영광을 찬양함으로써 응답합니다.
                      성부 하나님을 중심으로 삼위 하나님을 찬송합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2단계 */}
              <div className="rounded-xl border bg-background p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                  <h4 className="font-bold text-base">고백과 용서</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3 break-keep">
                  하나님을 1차로 만난 다음, 좀 더 깊이 2차적 만남으로 들어갑니다.
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-secondary/60 border p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↑</span>신앙고백
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      사도신경의 순서를 따라 성부 하나님과 그 창조하심, 성자 예수님과 구원의 일하심,
                      성령 하나님과 그 은혜를 고백합니다. 매주 하는 고백이라 형식적으로 되지 않도록
                      또박또박, 조금은 천천히 고백합니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↓↑</span>고백의 기도 · 사죄의 선언
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      우리 자신의 죄와 영적·정신적·육체적 고통을 생각하면서 용서를 구하고 힘 주실 것을
                      간구합니다. 예수 그리스도의 피로 용서하시고 성령님의 새롭게 하심을 확신하면서
                      기도합니다. 목사가 정리하는 대표 기도를 통해 사죄를 선언합니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/60 border p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↑</span>감사의 찬양
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      용서와 치유, 그리고 승리를 주신 삼위 하나님께 감사합니다.
                      주로 성자 예수님의 죄용서에 대한 찬송을 합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3단계 */}
              <div className="rounded-xl border bg-background p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                  <h4 className="font-bold text-base">말씀으로 오심</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3 break-keep">
                  하나님은 말씀과 성례로 우리에게 다가오시고 우리는 &ldquo;아멘&rdquo;으로 화답합니다.
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↓</span>성경
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      목사는 &ldquo;하나님의 말씀을 들으십시오&rdquo;라고 시작합니다. 말씀은 설교에 필요한
                      정보를 듣는 것이 아니라, 하나님이 목사의 목소리를 통해 지금 말씀하십니다.
                      마치 구약의 지성소의 법궤 위에서 하나님이 교회를 만나 말씀하신 것처럼 말입니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/60 border p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↑</span>조명을 위한 기도
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      하늘 문과 성경의 말씀을 여시고 우리 마음 문을 여셔서 교회가 깨닫고
                      순종할 수 있게 해 달라고 성령님께 기도합니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↓</span>말씀
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      하나님이 기록해 주신 말씀을 통해 지금 우리 교회에 구체적으로 하시는 말씀을
                      듣습니다. 단지 내용을 생각만 하는 것이 아니라 말씀을 통해 나아오시는 하나님
                      앞에 회개하고 영적으로 절하며 찬양합니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/60 border p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↑</span>결단의 기도
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      주신 말씀을 요약하며 화답하고, 내가 더 믿어야 할 것과 변화되어야 할
                      행동 등을 생각하며 헌신의 삶을 결단합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3-1 성례 */}
              <div className="rounded-xl border bg-background p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-7 items-center rounded-full bg-primary/80 text-primary-foreground text-xs font-bold px-2.5">3-1</span>
                  <h4 className="font-bold text-base">성례로 오심 — 보이는 말씀</h4>
                  <span className="text-primary ml-auto text-sm">↓↑</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                  말씀의 예식이 귀에 들리는 복음이라면, 이제 하나님은 눈에 보이는 복음인 성례를
                  통해 우리에게 다가오시고 우리는 나아가서 감사를 드립니다. 세례의 물, 성찬의
                  빵과 포도주는 죽었다가 부활 승천하여 재림하실 그리스도의 구원의 전체 은혜를
                  눈으로 보여주고 그 은혜를 전달해 줍니다.
                </p>
              </div>

              {/* 4단계 */}
              <div className="rounded-xl border bg-background p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                  <h4 className="font-bold text-base">감사로 응답</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3 break-keep">
                  하나님과의 네 번째 만남, 우리를 드리는 시간입니다.
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-secondary/60 border p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↑</span>감사의 예물 · 찬송
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      말씀과 예배 전체를 통해 주신 은혜를 감사하며 입술의 열매인 찬송과
                      손의 열매인 헌금으로 감사를 올립니다. 주로 성령 하나님을 통해 그리스도와
                      연합되어 거룩한 삶을 살게 되는 축복을 찬송합니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/60 border p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↑</span>드리는 기도
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      교회의 감사를 담아서 하나님께 기도로 올립니다. 이제 세상으로 나가
                      하나님 나라의 백성으로 열매를 맺고 하나님 나라를 섬기게 해 달라고 간구합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 5단계 */}
              <div className="rounded-xl border bg-background p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">5</span>
                  <h4 className="font-bold text-base">파송</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3 break-keep">
                  하나님은 &ldquo;일어서 뒤로 돌아. 세상을 향해 앞으로 가!&rdquo; 말씀하시며
                  성도들을 왕으로서 하나님 나라를 전파하도록 파송하십니다.
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↓↑</span>파송의 찬송
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      하나님께서 우리에게 사명주시고 파송하시는 음성을 들으며
                      그 사명에 헌신하겠다는 결단으로 찬송합니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
                    <p className="text-sm font-semibold mb-1">
                      <span className="inline-block text-primary mr-1">↓</span>축도
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed break-keep">
                      축도는 하나님이 하시는 축복의 말씀을 목사가 대신 선언하는 것입니다.
                      예배에서의 만남과 은혜를 한 마디로 요약하고, 앞으로 인생에서 계속
                      축복해 주실 것을 다시 약속하는 것입니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <blockquote className="rounded-xl border-l-4 border-primary bg-primary/5 p-4 text-sm leading-relaxed break-keep italic font-medium">
              예배의 성공에서 그리스도인의 삶의 승리가 시작됩니다.
              온 세상 교회와 함께 우리 교회도 예수님 오실 날까지 자라고 승리할 것을 믿습니다.
            </blockquote>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* 신앙고백 */}
      <Card id="confession" className="mb-6 scroll-mt-28">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <BookOpenText weight="light" className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">신앙고백</h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-foreground/90">
            <div>
              <h3 className="font-semibold mb-2">사도신경</h3>
              <p className="text-sm text-foreground/80">
                전능하사 천지를 만드신 하나님 아버지를 내가 믿사오며, 그 외아들 우리 주 예수
                그리스도를 믿사오니, 이는 성령으로 잉태하사 동정녀 마리아에게 나시고,
                본디오 빌라도에게 고난을 받으사 십자가에 못 박혀 죽으시고, 장사한 지
                사흘 만에 죽은 자 가운데서 다시 살아나시며, 하늘에 오르사 전능하신
                하나님 우편에 앉아 계시다가, 저리로서 산 자와 죽은 자를 심판하러
                오시리라. 성령을 믿사오며, 거룩한 공회와 성도가 서로 교통하는 것과
                죄를 사하여 주시는 것과 몸이 다시 사는 것과 영원히 사는 것을 믿사옵나이다.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">니케아 신조 (325, 381)</h3>
              <p className="text-sm italic text-muted-foreground">
                &ldquo;우리는 하나의 거룩하고 보편적이며 사도적 교회(One Holy Catholic Apostolic Church)를 믿습니다.&rdquo;
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">웨스트민스터 소요리문답 제1문</h3>
              <p className="text-sm text-foreground/80">
                <strong>문:</strong> 사람의 제일 되는 목적이 무엇입니까?
              </p>
              <p className="text-sm text-foreground/80 mt-1">
                <strong>답:</strong> 사람의 제일 되는 목적은 하나님을 영화롭게 하고
                영원토록 그를 즐거워하는 것입니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* 개혁교회의 뿌리 / 이름 변경 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <TreeStructure weight="light" className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">좋은교회에서 관악교회로</h2>
          </div>
          <div className="space-y-3 text-base leading-relaxed text-foreground/90">
            <p className="text-sm text-foreground/80">
              좋은교회는 2013년 공동의회를 거쳐 4월 봄노회의 승인을 받아, 관악교회로 개명했습니다.
            </p>
            <div className="space-y-2 pl-4 border-l-2 border-primary/20">
              <p className="text-sm text-foreground/80">
                <strong>첫째,</strong> 관악지역과 그 지역의 영혼들을 섬기는 사명에 집중하고 지역교회로서 확고하게 뿌리를 내리기 위함입니다.
              </p>
              <p className="text-sm text-foreground/80">
                <strong>둘째,</strong> 교회 인근 이단집단인 기독교 복음 선교회(JMS) 소속의 교회가 동일한 명칭을 사용하여 혼동을 주었습니다.
              </p>
              <p className="text-sm text-foreground/80">
                <strong>셋째,</strong> &ldquo;좋은 교회&rdquo;라는 명칭이 다른 교회를 &ldquo;나쁜 교회&rdquo;로 판단하는 것처럼 인상을 줄 수 있어 교회 간 덕을 증진하기 위함입니다.
              </p>
              <p className="text-sm text-foreground/80">
                <strong>넷째,</strong> &ldquo;관악교회&rdquo;는 관악산 기슭 지역을 1차적 사역지로 받는다는 사명감을 잘 나타냅니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* 교회 연혁 */}
      <Card id="history" className="scroll-mt-28">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Clock weight="light" className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">교회 연혁</h2>
          </div>
          <div className="space-y-5">
            {[...HISTORY].reverse().map((item) => (
              <div key={item.year} className="flex gap-4">
                <div className="shrink-0 w-14 pt-0.5">
                  <span className="font-bold text-primary text-base">{item.year}</span>
                </div>
                <ul className="space-y-1.5 text-sm text-foreground/90 break-keep">
                  {item.events.map((event, i) => (
                    <li key={`${item.year}-${i}`} className="leading-relaxed">
                      {event}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 하단 연락처 CTA — 페이지 마지막에 다시 한번 */}
      <div className="mt-8 rounded-xl border border-primary/20 bg-secondary/40 p-6 text-center space-y-3">
        <p className="text-base font-semibold">문의 사항이 있으시면 연락해 주세요</p>
        <a
          href={`tel:${SITE_CONFIG.phone}`}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-lg font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Phone weight="fill" className="h-5 w-5" />
          {SITE_CONFIG.phone}
        </a>
        <p className="text-sm text-muted-foreground">월~금 오전 9시 ~ 오후 6시</p>
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
            <Scroll weight="light" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">사역자</p>
            <p className="text-base text-foreground/90">유해신 목사 (담임) · 류영협 강도사</p>
            <p className="text-sm text-muted-foreground mt-0.5">안광우 강도사 (청년부) · 김인용 전도사 (중고등부)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
