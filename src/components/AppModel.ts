import { IProduct, IProductCart, ISuccessOrder, IOrderData } from '../types';
import { IAppAPI } from './AppAPI';
import { IEvents } from './base/events';

export interface IAppModel {
	products: IProduct[];
	cart: IProductCart[];

	addToCart(product: IProductCart): void;
	delFromCart(productId: string): void;
	isInCart(id: string): boolean;
	sendOrder(orderData: IOrderData): Promise<ISuccessOrder>;
	clearCart(): void;
}

export class AppModel implements IAppModel {
	protected AppAPI: IAppAPI;
	protected events: IEvents;

	products: IProduct[] = [];
	cart: IProductCart[] = [];

	constructor(AppAPI: IAppAPI, events: IEvents) {
		this.AppAPI = AppAPI;
		this.events = events;
		this.initialize();
	}

	private initialize() {
		this.fetchProducts()
			.then((products) => {
				this.products = products;
				this.events.emit('products:fetched', products);
			})
			.catch((error) => {
				console.log('Ошибка загрузки продуктов:', error);
			});

		this.getCart();
	}

	private fetchProducts(): Promise<IProduct[]> {
		return this.AppAPI.getProducts();
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
