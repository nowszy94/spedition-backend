import { COMPANY_ID } from '../const';

export const knownUsers = [
  {
    id: '1',
    name: 'Dominik Kasprzak',
    email: 'd.kasprzak@rajkotransport.eu',
    phoneNumber: '+48 451-683-803',
    companyId: COMPANY_ID,
  },
  {
    id: '2',
    name: 'Szymon Nowak',
    email: 'nowszy94@gmail.com',
    phoneNumber: '+48 785 419 047',
    companyId: COMPANY_ID,
  },
  {
    id: '3',
    name: 'Agnieszka Jagła',
    email: 'rajkosped@gmail.com',
    phoneNumber: '+48 690 278 776',
    companyId: COMPANY_ID,
  },
];

export type KnownUser = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  companyId: string;
};
