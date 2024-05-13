import { IProduct, categoryKey, productCategory } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Product extends Component<IProduct> {
	protected _categoryElem: HTMLElement;
	protected _titleElem: HTMLElement;
	protected _imageElem: HTMLImageElement;
	protected _priceElem: HTMLElement;
	public product: IProduct;
	events: IEvents;

	constructor(container: HTMLElement, product: IProduct, events: IEvents) {
		super(container);
		this.product = product;
		this.events = events;
		this._categoryElem = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);
		this._titleElem = ensureElement<HTMLElement>(
			'.card__title',
			this.container
		);
		this._imageElem = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);

		this._priceElem = ensureElement<HTMLElement>(
			'.card__price',
			this.container
		);
	}

	set category(category: categoryKey) {
		this._categoryElem.textContent = category;
		this._categoryElem.classList.add(
			`card__category_${productCategory[category]}`
		);
	}

	set title(title: string) {
		this._titleElem.textContent = title;
	}

	set image(src: string) {
		this._imageElem.src = src;
		this._imageElem.alt = this.product.title;
	}

	set price(price: number) {
		if (price) {
			this._priceElem.textContent = `${price} синапсов`;
		} else {
			this._priceElem.textContent = 'Бесценно';
		}
	}
}
