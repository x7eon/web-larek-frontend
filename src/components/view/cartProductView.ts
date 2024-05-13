import { IProductCart } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class CartProductView extends Component<IProductCart> {
	events: IEvents;
	private indexElem: HTMLElement;
	private titleElem: HTMLElement;
	private priceElem: HTMLElement;
	private buttonElem: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents, product: IProductCart) {
		super(container);
		this.events = events;
		this.indexElem = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);

		this.titleElem = ensureElement<HTMLElement>('.card__title', this.container);

		this.priceElem = ensureElement<HTMLElement>('.card__price', this.container);

		this.buttonElem = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);

		this.buttonElem.addEventListener('click', () => {
			events.emit('product:delFromCart', { ...product });
		});
	}

	set title(title: string) {
		this.titleElem.textContent = title;
	}

	set index(index: number) {
		this.indexElem.textContent = index.toString();
	}

	set price(price: number) {
		if (price) {
			this.priceElem.textContent = price.toString() + ' синапсов';
		} else {
			this.priceElem.textContent = 'Бесценно';
		}
	}
}
