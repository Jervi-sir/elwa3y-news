export interface Article {
  id: number;
  slug: string;
  title: string;
  recap: string;
  content: string;
  content_text: string;
  thumbnail: string;
  uploaded_since: string;
  created_at: string;
  category_name: string;
  time_to_read: string;
  views: number;
  author_pic: string;
  author_name: string;
  author_slug: string;
  author_bio: string;
  tags: string[];
  duration: string;
  nb_likes: number;
  nb_comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}
