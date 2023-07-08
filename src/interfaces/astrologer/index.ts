import { ChartInterface } from 'interfaces/chart';
import { UserInterface } from 'interfaces/user';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface AstrologerInterface {
  id?: string;
  user_id: string;
  organization_id: string;
  created_at?: any;
  updated_at?: any;
  chart?: ChartInterface[];
  user?: UserInterface;
  organization?: OrganizationInterface;
  _count?: {
    chart?: number;
  };
}

export interface AstrologerGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  organization_id?: string;
}
