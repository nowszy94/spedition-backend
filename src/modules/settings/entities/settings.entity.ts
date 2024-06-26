export type Settings = {
  companyId: string;
  companyDetails: {
    name: string;
    nip: string;
    address: string;
    email: string;
    phoneNumber: string;
  };
  speditionOrderPolicy: {
    [key in 'payments' | 'contractor' | 'driver']: {
      name: string;
      text: Array<string>;
    };
  };
  additionalPdfConfiguration: {
    paymentAnnotation: string;
    paymentDaysAnnotation: string;
  };
};
