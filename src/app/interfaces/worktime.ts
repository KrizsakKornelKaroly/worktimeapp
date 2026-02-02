import { User } from "./user";

export interface WorkTime {
  id?: string;
  userId: string;
  date: string | Date;
  start: string;
  end: string;
  user?: User | null;
}