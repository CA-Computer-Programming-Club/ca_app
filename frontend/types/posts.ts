export interface Post {
  id: number;
  type: "lost" | "found";
  title: string;
  location: string;
  description: string;
  image: string;
}

export type PostsArray = Post[];
