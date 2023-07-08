import { ChartInterface } from 'interfaces/chart';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CustomerInterface {
  id?: string;
  user_id: string;
  birth_time: any;
  birth_date: any;
  birth_place: string;
  created_at?: any;
  updated_at?: any;
  chart?: ChartInterface[];
  user?: UserInterface;
  _count?: {
    chart?: number;
  };
}

export interface CustomerGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  birth_place?: string;
}
