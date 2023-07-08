import { CustomerInterface } from 'interfaces/customer';
import { AstrologerInterface } from 'interfaces/astrologer';
import { GetQueryInterface } from 'interfaces';

export interface ChartInterface {
  id?: string;
  customer_id: string;
  astrologer_id: string;
  divisional_chart: string;
  planetary_combinations: string;
  created_at?: any;
  updated_at?: any;

  customer?: CustomerInterface;
  astrologer?: AstrologerInterface;
  _count?: {};
}

export interface ChartGetQueryInterface extends GetQueryInterface {
  id?: string;
  customer_id?: string;
  astrologer_id?: string;
  divisional_chart?: string;
  planetary_combinations?: string;
}
