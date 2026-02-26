export type ContentCategory = "dawn-prayer" | "sunday-sermon" | "catechism" | "bulletin" | "psalm-song";

export interface ContentEntry {
  id: string;
  category: ContentCategory;
  title: string;
  date: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  scriptureReference: string;
  content: string;
  preacher: string;
  createdAt: string;
  updatedAt: string;
  sourceBoard?: string;
  sourcePostId?: number;
  attachments?: { name: string; url: string }[];
}

export interface ContentFormData {
  category: ContentCategory;
  title: string;
  date: string;
  youtubeUrl: string;
  scriptureReference: string;
  content: string;
  preacher: string;
}
