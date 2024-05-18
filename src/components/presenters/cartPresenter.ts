import { IProductCart } from '../../types';
import { IAppModel } from '../AppModel';
import { IEvents } from '../base/events';
import { Presenter } from '../base/presenter';
import { IModal } from '../common/modal';
import { ICartView } from '../view/cartProductsView';

export class CartPresenter extends Presenter<ICartView> {
	constructor(
		model: IAppModel,
		events: IEvents,
		modal: IModal,
		private cartProductsView: ICartView
	) {
		super(model, events, modal, cartProductsView);
		this.handleUpdateView();
	}

	handleAddToCart(product: IProductCart): void {
		this._model.addToCart(product);
		this.handleUpdateView();
	}

	handleDelFromCart(id: string): void {
		this._model.delFromCart(id);
		this.handleUpdateView();
	}

	handleOpenModal() {
		this._modal.render({
			content: this.cartProductsView.render(),
		});
	}

	handleUpdateView() {
		const cartData = this._model.cart.map((item, index) => {
			return { ...item, index: index + 1 };
		});
		this.cartProductsView.updateView(cartData);
	}
}
