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
		view: ICartView
	) {
		super(model, events, modal, view);
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
			content: this._view.render(),
		});
	}

	handleUpdateView() {
		this._view.updateView(this._model.cart);
	}
}
