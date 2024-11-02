export interface Book {
  id: string;
  created: string;
  updated: string;
  title: string;
  author: string;
  cover_image: string | null;
  description: string | null;
  pdf_path: string | null;
}
