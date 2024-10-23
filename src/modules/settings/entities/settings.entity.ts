export type Settings = {
  companyId: string;
  companyDetails: {
    name: string;
    nip: string;
    address: string;
    email: string;
    phoneNumber: string;
  };
  speditionOrderPolicy: Array<{
    name: string;
    value: string;
  }>;
  additionalPdfConfiguration: {
    paymentAnnotation: string;
    paymentDaysAnnotation: string;
  };
};
