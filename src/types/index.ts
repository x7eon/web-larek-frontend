// тип ключей категорий
export type categoryKey =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// объект категорий с явным типом
export const productCategory: { [key in categoryKey]: string } = {
	'софт-скил': 'soft',
	другое: 'other',
	дополнительное: 'additional',
	кнопка: 'button',
	'хард-скил': 'hard',
};

// интерфейс, описывающий товар
export interface IProduct {
	id: string;
	category: string;
	title: string;
	image: string;
	price: number | null;
	description: string;
}

// интерфейс, описывающий элемнт товара в корзине
export interface IProductCart {
	id: string;
	price: number;
	title: string;
	index?: number;
}

// тип описывающий возможные методы оплаты
export type paymentMethod = 'card' | 'cash';

// интерфейс, описывающий состояние формы
export interface IFormState {
	valid: boolean;
	errors: string[];
}

// интерфейс, описывающий форму со способом оплаты. Расширяет IFormState
export interface IPaymentForm extends IFormState {
	payment: paymentMethod;
	address: string;
	render: (state: Partial<IPaymentForm> & IFormState) => HTMLElement;
}

// интерфейс, описывающий форму с контактами пользователя. Расширяет IFormState
export interface IContactsForm extends IFormState {
	email: string;
	phone: string;
	render: (state: Partial<IContactsForm> & IFormState) => HTMLElement;
}

// интерфейс, описывающий данные товаров в заказе
export interface IOrderProducts {
	total: number;
	items: string[];
}

// интерфейс, описывающий данные пользователя в заказе
export interface IOrderData extends IOrderProducts {
	payment: paymentMethod;
	address: string;
	email: string;
	phone: string;
}

// тип, описывающий ошибки форм
export type FormErrors = Partial<Record<keyof IOrderData, string>>;

// тип, описывающий состояние элемента кнопки
export type ButtonState = 'Купить' | 'Убрать из корзины';

// интерфейс данных успешного заказа, получаемого в ответе от сервера на post запрос
export interface ISuccessOrder {
	id: string;
	total: number;
}
