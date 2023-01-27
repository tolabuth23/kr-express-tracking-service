export interface IConstructor {
  data: any;
}

export interface IQRCode {
  getQR(): Promise<any>;
}
