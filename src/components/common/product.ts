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
		this.setText(this._categoryElem, category);
		this._categoryElem.classList.add(
			`card__category_${productCategory[category]}`
		);
	}

	set title(title: string) {
		this.setText(this._titleElem, title);
	}

	set image(src: string) {
		this.setImage(this._imageElem, src, this.product.title);
	}

	set price(price: number) {
		if (price) {
			this.setText(this._priceElem, `${price} синапсов`);
		} else {
			this.setText(this._priceElem, 'Бесценно');
		}
	}
}
