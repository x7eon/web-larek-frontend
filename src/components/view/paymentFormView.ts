import { IPaymentForm, paymentMethod } from '../../types';
import { Form } from '../common/form';
import { IEvents } from '../base/events';

export class PaymentFormView extends Form<IPaymentForm> {
	private buttonElems: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.buttonElems = Array.from(
			this.container.querySelectorAll('.button_alt')
		);
		this.buttonElems.forEach((button) => {
			button.addEventListener('click', (event) => {
				this.handlePaymentChange(event);
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: paymentMethod) {
		this.toggleClass(this.container.elements.namedItem(`${value}`) as HTMLButtonElement, 'button_alt-active');
	}

	private handlePaymentChange(event: Event) {
		const target = event.target as HTMLButtonElement;
		this.buttonElems.forEach((button) => {
			button.classList.remove('button_alt-active');
		})
		this.toggleClass(target, 'button_alt-active');

		this.events.emit('order.payment:change', {
			field: 'payment',
			value: target.name,
		});
	}
}
