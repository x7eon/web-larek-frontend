import './scss/styles.scss';
import { AppAPI } from './components/AppAPI';
import { AppModel } from './components/AppModel';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/modal';
import { CartPresenter } from './components/presenters/cartPresenter';
import { OrderPresenter } from './components/presenters/orderPresenter';
import { ProductPresenter } from './components/presenters/productPresenter';
import { CartProductsView } from './components/view/cartProductsView';
import { ContactsFormView } from './components/view/contactsFormView';
import { PaymentFormView } from './components/view/paymentFormView';
import { SuccessModalView } from './components/view/successModalView';
import { IOrderData, IProduct, IProductCart } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// темплейты
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const paymentFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// элементы
const modalWindow = ensureElement<HTMLElement>('#modal-container');
const page = ensureElement<HTMLElement>('.page__wrapper');
const cartButton = ensureElement<HTMLButtonElement>('.header__basket');

// базовые элементы
const events = new EventEmitter();
const appAPI = new AppAPI(CDN_URL, API_URL);
// const appModel = new AppModel(appAPI, events);
const appModel = new AppModel(events);

// общие элементы
const modal = new Modal(modalWindow, events);
const cart = new CartProductsView(cloneTemplate(cartTemplate), events);
const paymentForm = new PaymentFormView(
	cloneTemplate(paymentFormTemplate),
	events
);
const contactsForm = new ContactsFormView(
	cloneTemplate(contactsFormTemplate),
	events
);
const successModal = new SuccessModalView(
	cloneTemplate(successTemplate),
	events
);

// презентеры
const productPresenter = new ProductPresenter(appModel, events, modal, appAPI);
const cartPresenter = new CartPresenter(appModel, events, modal, cart);
const orderPresenter = new OrderPresenter(
	appModel,
	events,
	modal,
	paymentForm,
	contactsForm,
	successModal,
	appAPI
);

// события
events.on('products:fetched', () => {
	productPresenter.loadProducts();
});

events.on('product:selected', (data: IProduct) => {
	productPresenter.handleOpenModal(data);
});

events.on('product:addToCart', (data: IProductCart) => {
	cartPresenter.handleAddToCart(data);
});

events.on('product:delFromCart', (data: IProductCart) => {
	cartPresenter.handleDelFromCart(data.id);
});

events.on('modal:open', () => {
	page.classList.add('page__wrapper_locked');
});

events.on('modal:close', () => {
	page.classList.remove('page__wrapper_locked');
});

events.on('order:start', () => {
	orderPresenter.handleOpenPaymentForm();
});

events.on('order:submit', () => {
	orderPresenter.handleOpenContactsForm();
});

events.on('contacts:submit', () => {
	orderPresenter.handleSendOrderDetails();
	cartPresenter.handleUpdateView();
});

events.on(
	/^(order|contacts)\..*:change$/,
	(data: { field: keyof IOrderData; value: string }) => {
		orderPresenter.handleChangeInput(data.field, data.value);
	}
);

events.on('formErrors:change', (errors: Partial<IOrderData>) => {
	orderPresenter.handleErrors(errors);
});

cartButton.addEventListener('click', () => {
	cartPresenter.handleOpenModal();
});

events.on('order:done', () => {
	modal.close();
});
