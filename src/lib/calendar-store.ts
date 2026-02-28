"use client";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  createdAt: string;
}

const STORAGE_KEY = "gwanak-calendar";
const VERSION_KEY = "gwanak-calendar-version";
const DATA_VERSION = 2;

const sampleEvents: CalendarEvent[] = [
  {
    id: "ev-fri-2026-01-02",
    title: "금요기도회",
    date: "2026-01-02",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-01-04",
    title: "주일예배",
    date: "2026-01-04",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-newyear",
    title: "신년 첫 주일예배",
    date: "2026-01-04",
    time: "11:00",
    description: "2026년 새해 첫 주일예배",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-01-09",
    title: "금요기도회",
    date: "2026-01-09",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-01-11",
    title: "주일예배",
    date: "2026-01-11",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-01-16",
    title: "금요기도회",
    date: "2026-01-16",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-01-18",
    title: "주일예배",
    date: "2026-01-18",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-01-23",
    title: "금요기도회",
    date: "2026-01-23",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-01-25",
    title: "주일예배",
    date: "2026-01-25",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-seollal-eve",
    title: "설날 전날",
    date: "2026-01-28",
    time: "",
    description: "설날 연휴 (공휴일)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-seollal",
    title: "설날",
    date: "2026-01-29",
    time: "",
    description: "설날 (공휴일)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-seollal-next",
    title: "설날 연휴",
    date: "2026-01-30",
    time: "",
    description: "설날 연휴 (공휴일)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-01-30",
    title: "금요기도회",
    date: "2026-01-30",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-02-01",
    title: "주일예배",
    date: "2026-02-01",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-02-06",
    title: "금요기도회",
    date: "2026-02-06",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-02-08",
    title: "주일예배",
    date: "2026-02-08",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-02-13",
    title: "금요기도회",
    date: "2026-02-13",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-02-15",
    title: "주일예배",
    date: "2026-02-15",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-02-20",
    title: "금요기도회",
    date: "2026-02-20",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-02-22",
    title: "주일예배",
    date: "2026-02-22",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-02-27",
    title: "금요기도회",
    date: "2026-02-27",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-samil",
    title: "삼일절",
    date: "2026-03-01",
    time: "",
    description: "삼일절 (공휴일)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-03-01",
    title: "주일예배",
    date: "2026-03-01",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-03-06",
    title: "금요기도회",
    date: "2026-03-06",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-03-08",
    title: "주일예배",
    date: "2026-03-08",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-03-13",
    title: "금요기도회",
    date: "2026-03-13",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-03-15",
    title: "주일예배",
    date: "2026-03-15",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-03-20",
    title: "금요기도회",
    date: "2026-03-20",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-03-22",
    title: "주일예배",
    date: "2026-03-22",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-03-27",
    title: "금요기도회",
    date: "2026-03-27",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-03-29",
    title: "주일예배",
    date: "2026-03-29",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-04-03",
    title: "금요기도회",
    date: "2026-04-03",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-04-05",
    title: "주일예배",
    date: "2026-04-05",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-easter",
    title: "부활주일 예배",
    date: "2026-04-05",
    time: "11:00",
    description: "부활절 주일예배 - 그리스도의 부활을 기념합니다",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-04-10",
    title: "금요기도회",
    date: "2026-04-10",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-04-12",
    title: "주일예배",
    date: "2026-04-12",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-04-17",
    title: "금요기도회",
    date: "2026-04-17",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-04-19",
    title: "주일예배",
    date: "2026-04-19",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-04-24",
    title: "금요기도회",
    date: "2026-04-24",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-04-26",
    title: "주일예배",
    date: "2026-04-26",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-05-01",
    title: "금요기도회",
    date: "2026-05-01",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-05-03",
    title: "주일예배",
    date: "2026-05-03",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-children",
    title: "어린이주일",
    date: "2026-05-03",
    time: "11:00",
    description: "어린이 주일예배 및 특별행사",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-childrensday",
    title: "어린이날",
    date: "2026-05-05",
    time: "",
    description: "어린이날 (공휴일)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-05-08",
    title: "금요기도회",
    date: "2026-05-08",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-05-10",
    title: "주일예배",
    date: "2026-05-10",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-05-15",
    title: "금요기도회",
    date: "2026-05-15",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-05-17",
    title: "주일예배",
    date: "2026-05-17",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-anniversary",
    title: "교회창립 기념 주일",
    date: "2026-05-17",
    time: "11:00",
    description: "관악교회 창립 17주년 기념 주일예배 (2009-05-17 설립)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-05-22",
    title: "금요기도회",
    date: "2026-05-22",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-05-24",
    title: "주일예배",
    date: "2026-05-24",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-05-29",
    title: "금요기도회",
    date: "2026-05-29",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-05-31",
    title: "주일예배",
    date: "2026-05-31",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-06-05",
    title: "금요기도회",
    date: "2026-06-05",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-hyunchungil",
    title: "현충일",
    date: "2026-06-06",
    time: "",
    description: "현충일 (공휴일)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-06-07",
    title: "주일예배",
    date: "2026-06-07",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-06-12",
    title: "금요기도회",
    date: "2026-06-12",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-06-14",
    title: "주일예배",
    date: "2026-06-14",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-06-19",
    title: "금요기도회",
    date: "2026-06-19",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-06-21",
    title: "주일예배",
    date: "2026-06-21",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-06-26",
    title: "금요기도회",
    date: "2026-06-26",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-06-28",
    title: "주일예배",
    date: "2026-06-28",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-07-03",
    title: "금요기도회",
    date: "2026-07-03",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-07-05",
    title: "주일예배",
    date: "2026-07-05",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-07-10",
    title: "금요기도회",
    date: "2026-07-10",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-07-12",
    title: "주일예배",
    date: "2026-07-12",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-07-17",
    title: "금요기도회",
    date: "2026-07-17",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-07-19",
    title: "주일예배",
    date: "2026-07-19",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-07-24",
    title: "금요기도회",
    date: "2026-07-24",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-07-26",
    title: "주일예배",
    date: "2026-07-26",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-07-31",
    title: "금요기도회",
    date: "2026-07-31",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-08-02",
    title: "주일예배",
    date: "2026-08-02",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-08-07",
    title: "금요기도회",
    date: "2026-08-07",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-08-09",
    title: "주일예배",
    date: "2026-08-09",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-08-14",
    title: "금요기도회",
    date: "2026-08-14",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-gwangbokjeol",
    title: "광복절",
    date: "2026-08-15",
    time: "",
    description: "광복절 (공휴일)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-08-16",
    title: "주일예배",
    date: "2026-08-16",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-08-21",
    title: "금요기도회",
    date: "2026-08-21",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-08-23",
    title: "주일예배",
    date: "2026-08-23",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-08-28",
    title: "금요기도회",
    date: "2026-08-28",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-08-30",
    title: "주일예배",
    date: "2026-08-30",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-09-04",
    title: "금요기도회",
    date: "2026-09-04",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-09-06",
    title: "주일예배",
    date: "2026-09-06",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-09-11",
    title: "금요기도회",
    date: "2026-09-11",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-09-13",
    title: "주일예배",
    date: "2026-09-13",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-09-18",
    title: "금요기도회",
    date: "2026-09-18",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-09-20",
    title: "주일예배",
    date: "2026-09-20",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-09-25",
    title: "금요기도회",
    date: "2026-09-25",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-09-27",
    title: "주일예배",
    date: "2026-09-27",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-10-02",
    title: "금요기도회",
    date: "2026-10-02",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-gaecheonjeol",
    title: "개천절",
    date: "2026-10-03",
    time: "",
    description: "개천절 (공휴일)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-10-04",
    title: "주일예배",
    date: "2026-10-04",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-hangeulnal",
    title: "한글날",
    date: "2026-10-09",
    time: "",
    description: "한글날 (공휴일)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-10-09",
    title: "금요기도회",
    date: "2026-10-09",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-10-11",
    title: "주일예배",
    date: "2026-10-11",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-10-16",
    title: "금요기도회",
    date: "2026-10-16",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-10-18",
    title: "주일예배",
    date: "2026-10-18",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-10-23",
    title: "금요기도회",
    date: "2026-10-23",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-10-25",
    title: "주일예배",
    date: "2026-10-25",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-10-30",
    title: "금요기도회",
    date: "2026-10-30",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-11-01",
    title: "주일예배",
    date: "2026-11-01",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-11-06",
    title: "금요기도회",
    date: "2026-11-06",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-11-08",
    title: "주일예배",
    date: "2026-11-08",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-11-13",
    title: "금요기도회",
    date: "2026-11-13",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-11-15",
    title: "주일예배",
    date: "2026-11-15",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-11-20",
    title: "금요기도회",
    date: "2026-11-20",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-11-22",
    title: "주일예배",
    date: "2026-11-22",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-11-27",
    title: "금요기도회",
    date: "2026-11-27",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-11-29",
    title: "주일예배",
    date: "2026-11-29",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-advent1",
    title: "대강절 첫째 주일",
    date: "2026-11-29",
    time: "11:00",
    description: "대강절(Advent) 시작 - 성탄을 준비하는 기간",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-12-04",
    title: "금요기도회",
    date: "2026-12-04",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-12-06",
    title: "주일예배",
    date: "2026-12-06",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-12-11",
    title: "금요기도회",
    date: "2026-12-11",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-12-13",
    title: "주일예배",
    date: "2026-12-13",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-12-18",
    title: "금요기도회",
    date: "2026-12-18",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-12-20",
    title: "주일예배",
    date: "2026-12-20",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-christmas",
    title: "성탄예배",
    date: "2026-12-25",
    time: "11:00",
    description: "성탄절 특별예배",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-fri-2026-12-25",
    title: "금요기도회",
    date: "2026-12-25",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sun-2026-12-27",
    title: "주일예배",
    date: "2026-12-27",
    time: "11:00",
    description: "오전 11시 주일예배 (관악구 대학길 52, 3층)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-yeend",
    title: "송년 감사예배",
    date: "2026-12-27",
    time: "11:00",
    description: "2026년 한 해를 마무리하는 감사예배",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

function loadFromStorage(): CalendarEvent[] {
  if (typeof window === "undefined") return [...sampleEvents];
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== String(DATA_VERSION)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
      return [...sampleEvents];
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CalendarEvent[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  try {
    localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  } catch {
    // ignore
  }
  return [...sampleEvents];
}

function saveToStorage(data: CalendarEvent[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  } catch {
    // ignore
  }
}

let events: CalendarEvent[] = loadFromStorage();
let listeners: Array<() => void> = [];

function notify() {
  saveToStorage(events);
  for (const listener of listeners) {
    listener();
  }
}

export function getCalendarEvents(): CalendarEvent[] {
  return events;
}

export function getEventsByDate(date: string): CalendarEvent[] {
  return events.filter((e) => e.date === date);
}

export function addCalendarEvent(data: Omit<CalendarEvent, "id" | "createdAt">): CalendarEvent {
  const newEvent: CalendarEvent = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  events = [newEvent, ...events];
  notify();
  return newEvent;
}

export function deleteCalendarEvent(id: string): boolean {
  const before = events.length;
  events = events.filter((e) => e.id !== id);
  if (events.length < before) {
    notify();
    return true;
  }
  return false;
}

export function subscribeCalendar(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
