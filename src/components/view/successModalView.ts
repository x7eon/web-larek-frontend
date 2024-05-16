import { ISuccessOrder } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface ISuccessModalView {
	render(data?: Partial<ISuccessOrder>): HTMLElement;
}

export class SuccessModalView
	extends Component<ISuccessOrder>
	implements ISuccessModalView
{
	private descriptionElem: HTMLElement;
	private buttonElem: HTMLButtonElement;
	private events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.descriptionElem = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		this.buttonElem = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		this.buttonElem.addEventListener('click', () => {
			this.events.emit('order:done');
		});
	}

	set total(total: string) {
		this.setText(this.descriptionElem, `Списано ${total} синапсов`); // новый вариант
	}
}
