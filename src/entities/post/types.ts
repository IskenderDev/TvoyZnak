export type PostDTO = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  image?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type Post = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
};

export type PostCreatePayload = {
  title: string;
  description: string;
  imageFile?: File | null;
};

export type PostUpdatePayload = {
  id: string;
  title: string;
  description: string;
  imageFile?: File | null;
  clearImage?: boolean;
};

export type PostsListParams = {
  page?: number;
  size?: number;
  search?: string;
  sort?: "createdAt.asc" | "createdAt.desc";
};
