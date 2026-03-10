"use client";

import { Cross, BookOpenText, TreeStructure, Clock, Church, Scroll, NavigationArrow, Phone, Envelope } from "@phosphor-icons/react";
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
          <div className="space-y-3 text-base leading-relaxed text-foreground/90">
            <p className="italic text-muted-foreground text-sm">
              &ldquo;너희는 ... 왕 같은 제사장들이요 ... 이는 너희를 어두운 데서 불러 내어
              그의 기이한 빛에 들어가게 하신 자의 아름다운 덕을 선전하게 하려 하심이라&rdquo; (벧전 2:9)
            </p>
            <p>
              관악교회는 사도신경과 니케아 신조, 개혁-장로교 전통의 웨스트민스터 고백서들과
              하이델베르크 요리문답을 성경을 이해하는 좋은 나침반으로 삼고 있습니다.
            </p>
            <p>
              2009년 5월 17일, 유해신 목사 인도로 관악구 봉천동에서 3가정 6명의 성도가
              첫 예배를 드리며 시작된 관악교회(당시 좋은교회)는, 하나님의 말씀에 순종하여
              구원의 은혜를 받고, 온 세상에 하나님 나라를 세워 가는 교회로 성장해 왔습니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 교회를 세우는 7가지 원리 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Church weight="light" className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">관악교회가 세워가는 교회</h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-foreground/90">
            <div>
              <h3 className="font-semibold mb-1">1. 교회에 주신 하나님의 말씀에 순종하는 교회</h3>
              <p className="text-sm text-foreground/80">
                하나님은 그리스도의 십자가 복음 말씀과 성령님을 통해 믿는 자들을 구원하셔서
                하나이고 거룩하고 보편적이고 사도적인 교회(OHCA)를 세워 주셨습니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">2. 교회의 회원과 직분자를 바로 세우는 교회</h3>
              <p className="text-sm text-foreground/80">
                말씀과 바른 예배를 통해 한 명 한 명의 교인들을 믿음으로 세우고 일상에서
                그리스도의 다스림을 받는 왕 같은 제사장으로 양육합니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">3. 예배에서 은혜 받고 헌신하는 교회</h3>
              <p className="text-sm text-foreground/80">
                예배를 통해 은혜를 받고 주님께 더욱 헌신하는 인격으로 성장합니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">4. 예배, 성경공부, 나눔을 통해 함께 성장하는 교회</h3>
              <p className="text-sm text-foreground/80">
                하이델베르크 요리문답으로 성경을 배우며 교회가 같은 신앙고백으로 하나 되어 갑니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">5. 개인적 격려와 공적인 격려로서 권징을 시행하는 교회</h3>
              <p className="text-sm text-foreground/80">
                목사와 직분자들이 개인과 가정을 수시로 심방하여 위로하고 격려합니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">6. 관계와 참된 예배를 통해 전도하는 교회</h3>
              <p className="text-sm text-foreground/80">
                성도들이 예배를 통해 하나님의 큰 은혜를 받고 일상에서 하나님 나라의 백성으로
                능력 있게 살아갈 때 다른 영혼에 대한 관심이 자연적으로 생깁니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">7. 예배의 은혜로 세상을 축복하며 하나님 나라를 세워 가는 교회</h3>
              <p className="text-sm text-foreground/80">
                성도는 말씀과 예배에 순종하는 삶을 통해 가정, 직장, 시민사회에서
                하나님의 복을 전달하는 축복의 근원이 됩니다.
              </p>
            </div>
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
            <p className="text-base text-foreground/90">유해신 목사 (담임) · 류영협 전도사</p>
            <p className="text-sm text-muted-foreground mt-0.5">안광우 강도사 (청년부) · 김인용 전도사 (중고등부)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
