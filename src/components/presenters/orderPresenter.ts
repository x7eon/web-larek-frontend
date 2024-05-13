import {
	IPaymentForm,
	IContactsForm,
	IOrderData,
	ISuccessOrder,
	FormErrors,
} from '../../types';
import { IAppModel } from '../AppModel';
import { IEvents } from '../base/events';
import { Presenter } from '../base/presenter';
import { IModal } from '../common/modal';
import { ISuccessModalView } from '../view/successModalView';

export class OrderPresenter extends Presenter<
	IPaymentForm,
	IContactsForm,
	ISuccessModalView
> {
	private orderDetails: IOrderData;
	private formErrors: FormErrors = {};

	constructor(
		model: IAppModel,
		events: IEvents,
		modal: IModal,
		paymentForm: IPaymentForm,
		contactsForm: IContactsForm,
		successModal: ISuccessModalView
	) {
		super(model, events, modal, paymentForm, contactsForm, successModal);
	}

	handleOpenPaymentForm() {
		this.orderDetails = {
			payment: 'card',
			address: '',
			email: '',
			phone: '',
			total: this._model.cart.reduce((sum, item) => sum + item.price, 0),
			items: this._model.cart.map((item) => item.id),
		};

		this._modal.render({
			content: this._view.render({
				address: '',
				payment: 'card',
				valid: false,
				errors: [],
			}),
		});
	}

	handleOpenContactsForm() {
		this._modal.render({
			content: this._view2.render({
				email: '',
				phone: '',
				valid: false,
				errors: [],
			}),
		});
	}

	handleChangeInput<K extends keyof IOrderData>(
		field: K,
		value: IOrderData[K] | string
	) {
		if (typeof value === 'string') {
			this.orderDetails[field] = value as IOrderData[K];
		}
		this.validateOrder();
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.orderDetails.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.orderDetails.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.orderDetails.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		if (!this.orderDetails.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this._events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	handleErrors(errors: Partial<IOrderData>) {
		const { email, phone, payment, address } = errors;
		this._view.valid = !address;
		this._view2.valid = !email && !phone;
		this._view.errors = Object.values({ address, payment });
		this._view2.errors = Object.values({ email, phone });
	}

	handleSendOrderDetails() {
		this._model.sendOrder(this.orderDetails).then((data: ISuccessOrder) => {
			this._events.emit('form:submit', { data });
			this._modal.render({
				content: this._view3.render({ ...data }),
			});
		});
		this.handleClearCart();
	}

	handleClearCart() {
		this._model.clearCart();
		this.orderDetails = {
			payment: 'card',
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	}
}
