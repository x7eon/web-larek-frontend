import { IProduct } from '../../types';
import { IEvents } from '../base/events';
import { Product } from '../common/product';

export class ProductView extends Product {
	constructor(container: HTMLElement, product: IProduct, events: IEvents) {
		super(container, product, events);
		this.container.addEventListener('click', () => {
			this.events.emit('product:selected', { ...this.product });
		});
	}
}
