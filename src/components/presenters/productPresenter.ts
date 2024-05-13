import { IProduct } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IAppModel } from '../AppModel';
import { IEvents } from '../base/events';
import { Presenter } from '../base/presenter';
import { IModal } from '../common/modal';
import { ProductView } from '../view/productView';
import { ProductPreview } from '../view/productPreview';

// элементы
const productContainer = ensureElement('.gallery');

// темплейты
const productTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productModal = ensureElement<HTMLTemplateElement>('#card-preview');

export class ProductPresenter extends Presenter {
	constructor(model: IAppModel, events: IEvents, modal: IModal) {
		super(model, events, modal);
	}

	loadProducts(): void {
		this._model.products.forEach((product) => {
			const productContentContainer = cloneTemplate(productTemplate);
			const productElement = new ProductView(
				productContentContainer,
				product,
				this._events
			);
			productContainer.append(productElement.render(product));
		});
	}

	handleOpenModal(product: IProduct): void {
		const productInCart = this._model.isInCart(product.id);

		const productPreview = new ProductPreview(
			cloneTemplate(productModal),
			product,
			this._events
		);

		if (productInCart) {
			productPreview.button = 'Убрать из корзины';
		}

		this._modal.render({
			content: productPreview.render(product),
		});
	}
}
