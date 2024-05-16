import { ButtonState, IProduct, IProductCart } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Product } from '../common/product';

export class ProductPreview extends Product {
	private descriptionElement: HTMLElement;
	private buttonElemenet: HTMLButtonElement;

	constructor(container: HTMLElement, product: IProduct, events: IEvents) {
		super(container, product, events);

		this.descriptionElement = ensureElement<HTMLElement>(
			'.card__text',
			this.container
		);

		this.buttonElemenet = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.container
		);

		this.buttonElemenet.addEventListener('click', () => {
			const data: IProductCart = {
				id: product.id,
				title: product.title,
				price: product.price,
			};

			if (this.buttonElemenet.textContent === 'Убрать из корзины') {
				this.setText(this.buttonElemenet, 'Купить');
				this.events.emit('product:delFromCart', { ...data });
			} else {
				this.setText(this.buttonElemenet, 'Убрать из корзины');
				this.events.emit('product:addToCart', { ...data });
			}
		});

		if (!this.product.price) {
			this.setDisabled(this.buttonElemenet, true);
		}
	}

	set button(buttonText: ButtonState) {
		this.setText(this.buttonElemenet, buttonText);
	}

	set description(description: string) {
		this.setText(this.descriptionElement, description);
	}
}
