import { Settings } from './entities/settings.entity';

const payments = `- Jeśli stawka podana jest w walucie EURO, prosimy o wystawienie faktury w EURO. Płatność kwoty netto w EURO, podatku VAT w PLN według średniego kursu NBP z dnia poprzedzającego dzień wykonania usługi (rozładunku),
- Jeśli stawka podana jest w walucie PLN, prosimy o wystawienie faktury w PLN.
- Prosimy o podanie na fakturze dwóch numerów rachunków bankowych (EURO i PLN – jeśli stawka jest podana w EURO),
- Prosimy o wpisanie na fakturze numeru naszego zlecenia,
- Termin płatności za fakturę wynosi 45 dni od momentu dostarczenia do nas prawidłowo wystawionej faktury oraz POTWIERDZONYCH dokumentów przewozowych,
- Warunkiem zapłaty za usługę jest dostarczenie wszystkich dokumentów transportowych wymaganych podczas transportu towaru (CMR,WZ,Liefershein,szczególnie jeśli są wskazane w dokumencie CMR),
`;

const contractor = `- Brak pisemnej odmowy przyjęcia zlecenia w ciągu 30 min oznacza jego przyjęcie do realizacji, oraz akceptację warunków zawartych w zleceniu,
- Przy realizacji zlecenia obowiązują przepisy konwencji CMR oraz prawa przewozowego,
- Przewoźnik przyjmując do realizacji zlecenie zobowiązany jest posiadać ważne ubezpieczenie OCP,
- Brak możliwości dodatkowego doładunku bez zgody zleceniodawcy,
- Brak możliwości dodatkowego odsprzedania zlecenia bez zgody zleceniodawcy,
- Postoje do 24h w miejscu załadunku i rozładunku oraz soboty, niedziele i święta są wolne od opłat postojowych. Dłuższy postój musi być udokumentowany. Wszelkie postoje i koszty nie objęte zleceniem muszą być natychmiast zgłoszone na piśmie, inaczej zastrzegamy sobie prawo odmowy do zapłaty dodatkowych obciążeń. Kara umowna za niepodstawienie samochodu wynosi 500 euro, za każdy dzień opóźnienia 150 euro (zachodzi gdy mimo opóźnienia usługa została wykonana).
`;

const driver = `- Kierowca ma obowiązek sprawdzenia stanu faktycznego ładunku z treścią listu przewozowego lub innego dokumentu załadunku. W przypadku wystąpienia jakichkolwiek rozbieżności konieczne jest wpisanie takiej informacji w CMR pod rygorem obciążenia finansowego, a także niezwłoczne poinformowanie o wystąpieniu nieprawidłowości Zleceniodawcę.
- Kierowca jest zobowiązany do prawidłowego zabezpieczenia towaru w celu wyeliminowania przesunięć, uszkodzeń.
`;

const speditionOrderPolicyData: Settings['speditionOrderPolicy'] = {
  payments: { name: 'Płatności', text: payments.split('\n') },
  contractor: { name: 'Przewoźnik', text: contractor.split('\n') },
  driver: { name: 'Kierowca', text: driver.split('\n') },
};

export const mockSettings: Settings = {
  speditionOrderPolicy: speditionOrderPolicyData,
};
