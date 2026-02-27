import type { ContentEntry } from "@/types";

// 콘텐츠는 public/data/*.json (정적 파일)과 YouTube 동기화 스크립트로 관리됩니다.
// 관리자가 직접 추가한 항목은 localStorage에 저장됩니다.
export const sampleContents: ContentEntry[] = [];
