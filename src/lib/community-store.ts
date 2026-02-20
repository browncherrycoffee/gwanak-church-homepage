"use client";

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  title: string;
  content: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "gwanak-community";
const VERSION_KEY = "gwanak-community-version";
const DATA_VERSION = 1;

const samplePosts: CommunityPost[] = [
  {
    id: "post-welcome",
    author: "관리자",
    title: "관악교회 교인 커뮤니티에 오신 것을 환영합니다",
    content: "이곳은 관악교회 교인들을 위한 커뮤니티 공간입니다.\n서로를 위한 기도 제목, 나눔, 교제 등 자유롭게 글을 남겨주세요.\n사랑과 은혜 가운데 함께 성장해 나가는 공동체가 되기를 소망합니다.",
    comments: [
      {
        id: "comment-1",
        author: "김성도",
        content: "반갑습니다! 좋은 공간이 생겼네요.",
        createdAt: "2026-02-10T10:30:00.000Z",
      },
    ],
    createdAt: "2026-02-10T09:00:00.000Z",
    updatedAt: "2026-02-10T09:00:00.000Z",
  },
  {
    id: "post-prayer",
    author: "이은혜",
    title: "기도 부탁드립니다",
    content: "이번 주에 어머니 수술이 있습니다.\n수술이 잘 되도록 함께 기도해 주시면 감사하겠습니다.\n하나님의 치유하시는 은혜를 믿습니다.",
    comments: [
      {
        id: "comment-2",
        author: "박믿음",
        content: "기도하겠습니다. 하나님께서 함께하실 줄 믿습니다!",
        createdAt: "2026-02-15T14:20:00.000Z",
      },
      {
        id: "comment-3",
        author: "최감사",
        content: "어머니의 빠른 쾌유를 위해 기도합니다.",
        createdAt: "2026-02-15T16:00:00.000Z",
      },
    ],
    createdAt: "2026-02-15T12:00:00.000Z",
    updatedAt: "2026-02-15T12:00:00.000Z",
  },
];

function loadFromStorage(): CommunityPost[] {
  if (typeof window === "undefined") return [...samplePosts];
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== String(DATA_VERSION)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
      return [...samplePosts];
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CommunityPost[];
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
  return [...samplePosts];
}

function saveToStorage(data: CommunityPost[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  } catch {
    // ignore
  }
}

let posts: CommunityPost[] = loadFromStorage();
let listeners: Array<() => void> = [];

function notify() {
  saveToStorage(posts);
  for (const listener of listeners) {
    listener();
  }
}

export function getCommunityPosts(): CommunityPost[] {
  return posts;
}

export function getCommunityPost(id: string): CommunityPost | undefined {
  return posts.find((p) => p.id === id);
}

export function addCommunityPost(data: { author: string; title: string; content: string }): CommunityPost {
  const now = new Date().toISOString();
  const newPost: CommunityPost = {
    id: crypto.randomUUID(),
    ...data,
    comments: [],
    createdAt: now,
    updatedAt: now,
  };
  posts = [newPost, ...posts];
  notify();
  return newPost;
}

export function addComment(postId: string, data: { author: string; content: string }): Comment | null {
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) return null;
  const post = posts[index];
  if (!post) return null;

  const newComment: Comment = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  };

  const updated: CommunityPost = {
    ...post,
    comments: [...post.comments, newComment],
    updatedAt: new Date().toISOString(),
  };
  posts = [...posts.slice(0, index), updated, ...posts.slice(index + 1)];
  notify();
  return newComment;
}

export function deleteCommunityPost(id: string): boolean {
  const before = posts.length;
  posts = posts.filter((p) => p.id !== id);
  if (posts.length < before) {
    notify();
    return true;
  }
  return false;
}

export function subscribeCommunity(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
