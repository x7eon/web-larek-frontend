import { IEvents } from './base/events';
import { TProductCart, productId, IProduct } from '../types/index';

export interface ICartData {
	productsList: IProduct[];
	totalPrice: number | null;

	addProduct(product: IProduct): void;
	delProduct(productId: productId): void;
	resetCart(): void;
}

export class CartData implements ICartData {
	protected _productsList: IProduct[];
	protected _totalPrice: number | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set productsList(productsList: IProduct[]) {
		this._productsList = productsList;
	}

	get productsList() {
		return this._productsList;
  };

	set totalPrice(products: IProduct[]) {
		this._totalPrice = products.reduce((sum, item) => {
			return sum + item.price;
		}, 0);
	}

	get totalPrice(): number {
		return this._totalPrice;
	}

	addProduct(product: IProduct): void {
    this._productsList.push(product);
		this.events.emit('cart: changed');
  }

	delProduct(productId: productId): void {
		this._productsList = this._productsList.filter(product => product.id !== productId);
		this.events.emit('cart: changed');
  };
  
	resetCart(): void {
		this._productsList = [];
		this._totalPrice = null;
		this.events.emit('cart: changed');
  };

}
