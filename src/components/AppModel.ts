import { IProduct, IProductCart, ISuccessOrder, IOrderData } from '../types';
import { IAppAPI } from './AppAPI';
import { IEvents } from './base/events';

export interface IAppModel {
	products: IProduct[];
	cart: IProductCart[];
	AppAPI: IAppAPI;
	orderDetails: IOrderData | null;

	addToCart(product: IProductCart): void;
	delFromCart(productId: string): void;
	isInCart(id: string): boolean;
	sendOrder(orderData: IOrderData): Promise<ISuccessOrder>;
	clearCart(): void;
	setOrderDetails(orderDetails: IOrderData): void;
	clearOrderDetails(): void;
}

export class AppModel implements IAppModel {
	protected events: IEvents;
	AppAPI: IAppAPI;
	orderDetails: IOrderData | null = null;
	products: IProduct[] = [];
	cart: IProductCart[] = [];

	constructor(AppAPI: IAppAPI, events: IEvents) {
		this.AppAPI = AppAPI;
		this.events = events;
		this.getCart();
	}

	public setOrderDetails(orderDetails: IOrderData) {
		this.orderDetails = orderDetails;
	}

	public clearOrderDetails(): void {
		this.orderDetails = null;
	}

	private getCart(): void {
		const cart = localStorage.getItem('cart');
		if (cart) {
			this.cart = JSON.parse(cart);
		} else {
			this.cart = [];
		}
	}

	public isInCart(id: string): boolean {
		return this.cart.some((productInCart) => productInCart.id === id);
	}

	public addToCart(product: IProductCart): void {
		const isInCart = this.isInCart(product.id);

		if (!isInCart) {
			this.cart.push(product);
			localStorage.setItem('cart', JSON.stringify(this.cart));
		}
	}

	public delFromCart(productId: string): void {
		this.cart = this.cart.filter((product) => product.id !== productId);
		localStorage.setItem('cart', JSON.stringify(this.cart));
	}

	public clearCart(): void {
		this.cart = [];
		localStorage.setItem('cart', JSON.stringify(this.cart));
	}

	public sendOrder(orderData: IOrderData): Promise<ISuccessOrder> {
		return this.AppAPI.postOrder(orderData).then((data: ISuccessOrder) => data);
	}
}
