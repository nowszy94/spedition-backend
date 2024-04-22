export type SettingsDto = {
  speditionOrderPolicy: {
    [key in 'payments' | 'contractor' | 'driver']: {
      name: string;
      text: Array<string>;
    };
  };
};
