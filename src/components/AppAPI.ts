import { IOrderData, IProduct, ISuccessOrder } from '../types';
import { Api } from './base/api';

export interface IAppAPI {
	getProducts: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	postOrder: (orderData: IOrderData) => Promise<ISuccessOrder>;
}

export class AppAPI extends Api implements IAppAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then(
			(response: { total: number; items: IProduct[] }) => {
				return response.items.map((product) => ({
					...product,
					image: this.cdn + product.image,
				}));
			}
		);
	}

	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((data: IProduct) => ({
			...data,
			image: this.cdn + data.image,
		}));
	}

	postOrder(order: IOrderData): Promise<ISuccessOrder> {
		return this.post('/order', order).then((data: ISuccessOrder) => data);
	}
}
