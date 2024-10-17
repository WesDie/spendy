export type Category = {
  budget: number;
  color: string;
  created_at: string;
  group: number;
  icon: string;
  id: number;
  title: string;
  type: "expense" | "income";
};

export type Transaction = {
  id: string;
  amount: number;
  date: Date;
  title: string;
  group: number;
  type: string;
  user_id: string;
  created_at: Date;
  upcoming: number;
  recurring: boolean;
  category: {
    id: number;
    created_at: Date;
    title: string;
    color: string;
    budget: number;
    type: string;
    group: number;
    icon: string;
  };
};

export type User = {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
};

export type Group = {
  id: number;
  name: string;
  icon: string;
  type: "Personal" | "External";
  url: string;
  duplicateIndex: number;
};
