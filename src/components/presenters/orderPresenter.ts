import {
	IPaymentForm,
	IContactsForm,
	IOrderData,
	ISuccessOrder,
	FormErrors,
} from '../../types';
import { IAppAPI } from '../AppAPI';
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
	private formErrors: FormErrors = {};

	constructor(
		model: IAppModel,
		events: IEvents,
		modal: IModal,
		private paymentForm: IPaymentForm,
		private contactsForm: IContactsForm,
		private successModal: ISuccessModalView,
		AppAPI: IAppAPI
	) {
		super(
			model,
			events,
			modal,
			paymentForm,
			contactsForm,
			successModal,
			AppAPI
		);
	}

	handleOpenPaymentForm() {
		this._model.setOrderDetails({
			payment: 'card',
			address: '',
			email: '',
			phone: '',
			total: this._model.cart.reduce((sum, item) => sum + item.price, 0),
			items: this._model.cart.map((item) => item.id),
		});

		this._modal.render({
			content: this.paymentForm.render({
				address: '',
				payment: 'card',
				valid: false,
				errors: [],
			}),
		});
	}

	handleOpenContactsForm() {
		this._modal.render({
			content: this.contactsForm.render({
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
		const orderDetails = this._model.orderDetails;

		if (orderDetails) {
			if (typeof value === 'string') {
				orderDetails[field] = value as IOrderData[K];
			}
			this._model.setOrderDetails(orderDetails);
		}

		this.validateOrder();
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		const orderDetails = this._model.orderDetails;

		if (!orderDetails) {
			return false;
		}

		if (!orderDetails.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!orderDetails.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!orderDetails.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		if (!orderDetails.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this._events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	handleErrors(errors: Partial<IOrderData>) {
		const { email, phone, payment, address } = errors;
		this.paymentForm.valid = !address;
		this.contactsForm.valid = !email && !phone;
		this.paymentForm.errors = Object.values({ address, payment });
		this.contactsForm.errors = Object.values({ email, phone });
	}

	handleSendOrderDetails() {
		const orderDetails = this._model.orderDetails;

		if (orderDetails) {
			this._AppAPI
				.postOrder(orderDetails)
				.then((data: ISuccessOrder) => {
					this._events.emit('form:submit', { data });
					this._modal.render({
						content: this.successModal.render({ ...data }),
					});
					this.handleClearCart();
				})
				.catch((error) => {
					console.log('Ошибка отправки заказа:', error);
				});
		}
	}

	handleClearCart() {
		this._model.clearCart();
		this._model.clearOrderDetails();
	}
}
