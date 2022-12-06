export interface Session {
  id: string;
  timetable: string;
  date_start: string;
  date_end: string;
  createdAt: string;
  updatedAt: string;
  movie: Movie;
  type_session?: any;
  room: Room;
}
export interface Movie {
  id: string;
  title: string;
  censorship: string;
  category: string;
  duration: number;
  production_company: string;
  imageUrl: string;
  isPremiere: boolean;
  isNational: boolean;
  createdAt: string;
  updatedAt: string;
  description: string;
}
export interface Room {
  id: string;
  number: number;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  snacks?: null[] | null;
  tickets?: TicketsEntity[] | null;
  value_total: number;
  id: string;
  createdAt: string;
  updatedAt: string;
}
export interface TicketsEntity {
  id: string;
  value: number;
}

export interface Snack {
  id: string;
  name: string;
  value: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
