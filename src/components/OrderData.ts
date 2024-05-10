import {
	orderPaymentMethod,
	orderAddress,
	orderEmail,
	orderPhone,
	orderTotalPrice,
	orderItems,
	TOrderPaymentAndAdress,
	TOrderEmailAndPhone,
	IOrderSuccess,
} from '../types/index';
import { IEvents } from './base/events';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

// интерфейс, описывающий заказ
export interface IOrder {
	payment: orderPaymentMethod;
	address: orderAddress;
	email: orderEmail;
	phone: orderPhone;
	total: orderTotalPrice;
	items: orderItems;
}

// интерфейс, описывающий данные заказа и логику работы с ними
export interface IOrderData extends IOrder {
	payment: orderPaymentMethod;
	address: orderAddress;
	email: orderEmail;
	phone: orderPhone;
	total: orderTotalPrice;
	items: orderItems;
	setOrderData(orderData: IOrderData): void;
	getOrderData(): IOrder;
	validateOrder(): boolean;
	sendOrder(order: IOrder): void;
}

export class OrderData implements IOrderData {
	protected payment: orderPaymentMethod;
	protected email: orderEmail;
	protected phone: orderPhone;
	protected address: orderAddress;
	protected total: orderTotalPrice;
	protected items: orderItems;
	protected appAPI: IAppAPI;
	events: IEvents;
	formErrors: FormErrors = {};

	constructor(events: IEvents) {
		this.events = events;
	}

	setOrderData(orderData: IOrder): void {
		this.payment = orderData.payment;
		this.address = orderData.address;
		this.email = orderData.email;
		this.phone = orderData.phone;
		this.total = orderData.total;
		this.items = orderData.items;
		this.events.emit('order: saved');
	}

	getOrderData(): IOrder {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.total,
			items: this.items,
		};
	}

	// проверка одного поля
	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.payment) {
			errors.email = 'Необходимо выбрать способ оплаты';
		}
		if (!this.address) {
			errors.phone = 'Необходимо указать адрес';
		}
		if (!this.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	sendOrder(order: IOrder): Promise<IOrderSuccess> {
		return this.appAPI
			.postOrder(order)
			.then((data: IOrderSuccess) => data)
			.then.events.emit('order: sent');
	}
}
