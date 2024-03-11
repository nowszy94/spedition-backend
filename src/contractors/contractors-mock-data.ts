import { Contractor } from './entities/contractor.entity';

export const contractors: Contractor[] = [
  {
    id: '1319e962-eaef-4108-bea5-2e615c7c11b9',
    name: 'Rajko Sped Szymon Kosicki',
    phoneNumber: '+48 504 319 606',
    email: 'rajkosped@gmail.com',
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
    name: 'Krystian Balicki G-B. Transport',
    phoneNumber: '+48 123 456 789',
    email: 'example@gmail.com',
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
