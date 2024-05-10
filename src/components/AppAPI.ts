import { IApi, IOrder, IOrderSuccess, IOrderError, IProduct } from "../types";


export class AppAPI {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  getProductsList(): Promise<IProduct[]> {
    return this._baseApi.get<IProduct[]>(`/product`).then((products: IProduct[]) => products);
  }

  postOrder(order: IOrder): Promise<IOrderSuccess | IOrderError> {
    return this._baseApi.post<IOrderSuccess | IOrderError>(`/order`, order).then((orderResult: IOrderSuccess | IOrderError) => orderResult);
  }
}

