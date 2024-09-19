import { Menu } from './menu.model';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  phone: string;
  address: string;
  number: string;
  complement: string;
  district: string;
  file: string;
  active: boolean;
  menus: Menu[];
}
