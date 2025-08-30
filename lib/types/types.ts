
export type Recipe = {
  id: string;
  _id?: string; 
  title: string;
  description?: string;
  image?: string | null;
  likes?: number;
  comments?: Comment[];
  tags?: string[];
  createdAt?: string;
};

export type ApiResponse = {
  items: Recipe[];
  total: number;
  page: number;
  pagecount: number;
};

