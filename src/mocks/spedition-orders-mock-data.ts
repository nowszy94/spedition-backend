import { SpeditionOrder } from '../modules/spedition-orders/entities/spedition-order.entity';
import { COMPANY_ID } from '../const';

export const speditionOrders: SpeditionOrder[] = [
  {
    id: '3b71749f-13f4-4992-8b61-0fdc07df180f',
    orderId: '1/02/2024',
    companyId: COMPANY_ID,
    creationDate: new Date(2024, 1, 5).getTime(),
    creator: {
      id: '1',
      name: 'Dominik Kasprzak',
      email: 'd.kasprzak@rajkotransport.eu',
      phoneNumber: '+48 451-683-803',
    },
    contractor: {
      id: '1319e962-eaef-4108-bea5-2e615c7c11b9',
      name: 'Rajko Sp. j. Ewa Kosicka Kazimierz Rajewski',
      phoneNumber: '+48 504 319 606',
      address: 'Milkowo 47a, 64-720 Lubasz, PL',
      email: 'rajkosped@gmail.com',
      nip: '123456234',
      contact: {
        id: '174b9dfb-f1ab-4947-b84f-0e27cf2adee0',
        name: 'Krzysztof Kowalski',
        email: 'krzysztof.kowalski@gmail.com',
        phoneNumber: '593 222 591',
      },
    },
    driver: {
      name: 'Jan Kowalski',
      phoneNumber: '798 558 648',
      identityCardNumber: 'AVC 112TE5',
    },
    vehicle: {
      carLicensePlate: 'PZ 535CD',
      trailerLicensePlate: 'WX 556AV',
    },
    status: 'DRAFT',
    loading: {
      address: 'Seaking Poland Ltd Sp. z o.o., ul.Nowa 1B, 64-700 Czarnkow, PL',
      loadingNumber: '9qwer',
      date: new Date(2024, 1, 8).getTime(),
      additionalInfo: 'Dodatkowe informacje dotyczace zaladunku',
    },
    unloading: {
      address:
        'I.SEAKING FRANCE S.A.R.L C/O IDEA LOGISTIQUE ,LOGISTICTIPORT, 4 RUE JEAN-BAPTISTE MARCET BATIMENT C, 44570 TRIGNAC, FR',
      date: new Date(2024, 1, 12).getTime(),
      unloadingNumber: 'abc44',
      additionalInfo: 'Dodatkowe informacje dotyczace rozaladunku',
    },
    loadDetails: [],
    freight: {
      value: '3500',
      currency: 'PLN',
      vatRate: 23,
      paymentDays: 45,
    },
    additionalInfo: 'Dodatkowe informacje o zleceniu',
  },
  {
    id: 'b644e99f-d577-4e9c-969e-69e3a3333a39',
    orderId: '2/02/2024',
    companyId: COMPANY_ID,
    creationDate: new Date(2024, 1, 12).getTime(),
    creator: {
      id: '1',
      name: 'Dominik Kasprzak',
      email: 'd.kasprzak@rajkotransport.eu',
      phoneNumber: '+48 451-683-803',
    },
    contractor: {
      id: 'a685034d-0b0f-4dab-b94e-573ee6955521',
      name: 'Krystian Balicki G-B. Transport',
      address: 'Brzezinska 38, 64-700 Czarnkow, PL',
      phoneNumber: '+48 123 456 789',
      email: 'example@gmail.com',
      nip: '123456234',
      contact: {
        id: 'eb5da80b-8176-495d-9c23-d6557c49417f',
        name: 'Jan Nowak',
        email: 'jan.nowak@gmail.com',
        phoneNumber: '593 333 591',
      },
    },
    driver: {
      name: 'Jan Kowalski',
      phoneNumber: '798 558 648',
      identityCardNumber: 'AVC 112TE5',
    },
    vehicle: {
      carLicensePlate: 'PZ 535CD',
      trailerLicensePlate: 'WX 556AV',
    },
    status: 'INPROGRESS',
    loading: {
      address: 'Paper Gate , Zum Südtor 2 , D-18147 Rostock',
      date: new Date(2024, 1, 13).getTime(),
      loadingNumber: '1234',
      additionalInfo: '',
    },
    unloading: {
      address:
        'I.SEAKING FRANCE S.A.R.L C/O IDEA LOGISTIQUE ,LOGISTICTIPORT, 4 RUE JEAN-BAPTISTE MARCET BATIMENT C, 44570 TRIGNAC, FR',
      date: new Date(2024, 1, 15).getTime(),
      unloadingNumber: 'fas21',
      additionalInfo: '',
    },
    loadDetails: [],
    freight: {
      value: '3500',
      currency: 'PLN',
      vatRate: 23,
      paymentDays: 45,
    },
    additionalInfo: '',
  },
  {
    id: '526c4f19-882c-47fa-a0cc-eda2a50d3292',
    orderId: '3/02/2024',
    companyId: COMPANY_ID,
    creationDate: new Date(2024, 1, 12).getTime(),
    creator: {
      id: '2',
      name: 'Szymon Kosicki',
      email: 'sz.kasprzak@rajkotransport.eu',
      phoneNumber: '+48 504-319-606',
    },
    contractor: {
      id: 'a685034d-0b0f-4dab-b94e-573ee6955521',
      name: 'Krystian Balicki G-B. Transport',
      phoneNumber: '+48 123 456 789',
      email: 'example@gmail.com',
      nip: '123456234',
      address: 'Brzezinska 38, 64-700 Czarnkow, PL',
      contact: {
        id: 'eb5da80b-8176-495d-9c23-d6557c49417f',
        name: 'Jan Nowak',
        email: 'jan.nowak@gmail.com',
        phoneNumber: '593 333 591',
      },
    },
    driver: {
      name: 'Jan Kowalski',
      phoneNumber: '798 558 648',
      identityCardNumber: 'AVC 112TE5',
    },
    vehicle: {
      carLicensePlate: 'PZ 535CD',
      trailerLicensePlate: 'WX 556AV',
    },
    status: 'DONE',
    loading: {
      address:
        'EMW Stahl Service GmbH , Pfannenbergstrasse 1 , DE-57290 Neunkirchen',
      date: new Date(2024, 1, 22).getTime(),
      loadingNumber: '4312',
      additionalInfo: '',
    },
    unloading: {
      address:
        'I.SEAKING FRANCE S.A.R.L C/O IDEA LOGISTIQUE ,LOGISTICTIPORT, 4 RUE JEAN-BAPTISTE MARCET BATIMENT C, 44570 TRIGNAC, FR',
      date: new Date(2024, 1, 25).getTime(),
      unloadingNumber: 'abc44',
      additionalInfo: '',
    },
    loadDetails: [],
    freight: {
      value: '3500',
      currency: 'PLN',
      vatRate: 23,
      paymentDays: 45,
    },
    additionalInfo: '',
  },
  {
    id: '18ddac09-1167-49fd-a02a-b5ca21745548',
    orderId: '1/03/2024',
    companyId: COMPANY_ID,
    creationDate: new Date(2024, 2, 2).getTime(),
    creator: {
      id: '2',
      name: 'Szymon Kosicki',
      email: 'sz.kasprzak@rajkotransport.eu',
      phoneNumber: '+48 504-319-606',
    },
    contractor: {
      id: '1319e962-eaef-4108-bea5-2e615c7c11b9',
      name: 'Rajko Sp. j. Ewa Kosicka Kazimierz Rajewski',
      phoneNumber: '+48 504 319 606',
      address: 'Milkowo 47a, 64-720 Lubasz, PL',
      email: 'rajkosped@gmail.com',
      nip: '123456234',
      contact: {
        id: '174b9dfb-f1ab-4947-b84f-0e27cf2adee0',
        name: 'Krzysztof Kowalski',
        email: 'krzysztof.kowalski@gmail.com',
        phoneNumber: '593 222 591',
      },
    },
    driver: {
      name: 'Jan Kowalski',
      phoneNumber: '798 558 648',
      identityCardNumber: 'AVC 112TE5',
    },
    vehicle: {
      carLicensePlate: 'PZ 535CD',
      trailerLicensePlate: 'WX 556AV',
    },
    status: 'STORNO',
    loading: {
      address:
        'EMW Stahl Service GmbH , Pfannenbergstrasse 1 , DE-57290 Neunkirchen',
      date: new Date(2024, 1, 28).getTime(),
      loadingNumber: '12abc',
      additionalInfo: '',
    },
    unloading: {
      address: 'Gedia Poland Sp. z o.o. , ul. Staszica 2 , PL 67-100 Nowa Sól',
      date: new Date(2024, 2, 2).getTime(),
      unloadingNumber: 'ddaa1',
      additionalInfo: '',
    },
    loadDetails: [],
    freight: {
      value: '3500',
      currency: 'PLN',
      vatRate: 23,
      paymentDays: 60,
    },
    additionalInfo: '',
  },
];
