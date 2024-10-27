export interface Book {
  id: number;
  title: string;
  author: string;
  cover_image: string | null;
  description: string | null;
  pdf_path: string | null;
  created_at: string;
}
