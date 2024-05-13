import { IEvents } from './events';
import { IAppModel } from '../AppModel';
import { IModal } from '../common/modal';

export abstract class Presenter<V = undefined, V2 = undefined, V3 = undefined> {
	protected _events: IEvents;
	protected _model: IAppModel;
	protected _modal: IModal;
	protected _view?: V;
	protected _view2?: V2;
	protected _view3?: V3;

	constructor(
		model: IAppModel,
		events: IEvents,
		modal: IModal,
		view?: V,
		view2?: V2,
		view3?: V3
	) {
		this._model = model;
		this._events = events;
		this._modal = modal;
		this._view = view;
		this._view2 = view2;
		this._view3 = view3;
	}
}
