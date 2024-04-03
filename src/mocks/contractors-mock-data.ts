import { Contractor } from '../modules/contractors/entities/contractor.entity';
import { COMPANY_ID } from '../const';

export const mockContractors: Contractor[] = [
  {
    id: '1319e962-eaef-4108-bea5-2e615c7c11b9',
    companyId: COMPANY_ID,
    name: 'Rajko Sp. j. Ewa Kosicka Kazimierz Rajewski',
    nip: '123456936',
    phoneNumber: '+48 504 319 606',
    email: 'rajkosped@gmail.com',
    address: 'Milkowo 47a, 64-720 Lubasz, PL',
    additionalInfo: '',
    contacts: [
      {
        id: '174b9dfb-f1ab-4947-b84f-0e27cf2adee0',
        name: 'Krzysztof Kowalski',
        email: 'krzysztof.kowalski@gmail.com',
        phoneNumber: '593 222 591',
      },
    ],
  },
  {
    id: 'a685034d-0b0f-4dab-b94e-573ee6955521',
    companyId: COMPANY_ID,
    name: 'Krystian Balicki G-B. Transport',
    phoneNumber: '+48 123 456 789',
    email: 'example@gmail.com',
    address: 'Brzezinska 38, 64-700 Czarnkow, PL',
    nip: '123456234',
    additionalInfo: '',
    contacts: [
      {
        id: 'eb5da80b-8176-495d-9c23-d6557c49417f',
        name: 'Jan Nowak',
        email: 'jan.nowak@gmail.com',
        phoneNumber: '593 333 591',
      },
    ],
  },
];
