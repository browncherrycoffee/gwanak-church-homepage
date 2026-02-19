"use client";

import { Cross, BookOpenText, TreeStructure } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">교회 소개</h1>
      <p className="text-muted-foreground mb-8">
        관악교회는 대한예수교장로회(합신) 소속으로, 개혁신앙에 뿌리를 둔 말씀 중심의 교회입니다.
      </p>

      {/* 교회 소개 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Cross weight="light" className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">관악교회</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
            <p>
              관악교회는 서울 관악구에 위치한 대한예수교장로회(합신) 소속 교회입니다.
              하나님의 말씀을 충실히 선포하고, 성경이 가르치는 바른 교리 위에 서서
              하나님을 예배하며 이웃을 섬기는 공동체입니다.
            </p>
            <p>
              우리 교회는 매주일 예배와 새벽기도, 수요예배, 그리고 교리문답 교육을 통해
              성도들이 말씀 안에서 자라가도록 힘쓰고 있습니다.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* 개혁교회의 뿌리 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <TreeStructure weight="light" className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">개혁교회의 뿌리</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
            <p>
              개혁교회(Reformed Church)는 16세기 종교개혁자 존 칼빈(John Calvin)의
              신학적 전통을 따르는 교회입니다. &ldquo;오직 성경(Sola Scriptura)&rdquo;,
              &ldquo;오직 은혜(Sola Gratia)&rdquo;, &ldquo;오직 믿음(Sola Fide)&rdquo;,
              &ldquo;오직 그리스도(Solus Christus)&rdquo;, &ldquo;오직 하나님께 영광(Soli Deo Gloria)&rdquo;이라는
              다섯 가지 솔라(Five Solas)를 신앙의 기초로 삼습니다.
            </p>
            <p>
              대한예수교장로회(합신)은 웨스트민스터 신앙고백서와 대소요리문답을
              신조(信條)로 채택하고 있으며, 성경의 무오성과 충족성을 고백합니다.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* 신앙고백 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <BookOpenText weight="light" className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">신앙고백</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
            <div>
              <h3 className="font-medium mb-1">사도신경</h3>
              <p>
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
              <h3 className="font-medium mb-1">웨스트민스터 소요리문답 제1문</h3>
              <p>
                <strong>문:</strong> 사람의 제일 되는 목적이 무엇입니까?
              </p>
              <p>
                <strong>답:</strong> 사람의 제일 되는 목적은 하나님을 영화롭게 하고
                영원토록 그를 즐거워하는 것입니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
