export type ContentCategory = "dawn-prayer" | "sunday-sermon" | "catechism" | "bulletin";

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
