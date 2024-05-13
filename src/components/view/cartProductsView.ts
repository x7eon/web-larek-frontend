import { IProductCart } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { CartProductView } from './cartProductView';

// темплейты
const cartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

export interface ICartView {
	updateView(productsCart: IProductCart[]): void;
	render(data?: Partial<IProductCart[]>): HTMLElement;
}

export class CartProductsView
	extends Component<IProductCart[]>
	implements ICartView
{
	private events: IEvents;
	private listElem: HTMLElement;
	private totalPriceElem: HTMLElement;
	private buttonElem: HTMLButtonElement;
	private counterElem: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.listElem = ensureElement<HTMLElement>('.basket__list', this.container);

		this.totalPriceElem = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);

		this.buttonElem = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.buttonElem.addEventListener('click', () => {
			events.emit('order:start');
		});

		this.counterElem = ensureElement<HTMLElement>('.header__basket-counter');
	}

	updateView(productsCart: IProductCart[]): void {
		this.listElem.innerHTML = null;
		if (productsCart.length === 0) {
			this.toggleButton(true);
		} else {
			this.toggleButton(false);
			productsCart.forEach((productCart: IProductCart, index: number) => {
				const item = new CartProductView(
					cloneTemplate(cartTemplate),
					this.events,
					productCart
				);
				item.index = index + 1;
				this.listElem.appendChild(item.render(productCart));
			});
		}

		this.updateTotalPrice(productsCart);
		this.counterElem.textContent = productsCart.length.toString();
	}

	protected updateTotalPrice(productCart: IProductCart[]) {
		let totalPrice = 0;
		for (let i = 0; i < productCart.length; i++) {
			if (productCart[i].price) {
				totalPrice += productCart[i].price;
			}
		}
		this.totalPriceElem.textContent = `${totalPrice.toString()} синапсов`;
	}

	protected toggleButton(empty: boolean) {
		if (empty) {
			this.buttonElem.setAttribute('disabled', '');
		} else {
			this.buttonElem.removeAttribute('disabled');
		}
	}
}
