# Проектная работа "Веб-ларек"

## Оглавление
- [Описание приложения](#описание)
- [Установка и запуск](#установка-и-запуск)
-	[Документация](#документация)
	- [Описание данных и их типов](#описание-данных-и-их-типов)
	- [Описание архитектуры](#описание-архитектуры)
	- [Базовый код](#базовый-код)
		- [Класс API](#класс-api)
		- [Класс EventEmitter](#класс-eventemitter)
		- [Класс Component](#класс-component)
		- [Класс Presenter](#класс-presenter)
	- [Класс AppAPI](#класс-appapi)
	- [Слой данных (Model)](#слой-данных-model)
		- [Класc AppModel](#класc-appmodel)
	- [Слой отображения (View)](#слой-отображения-view)
		- [Класс Modal](#класс-modal)
		- [Класс Product](#класс-product)
		- [Класс Form](#класс-form)
		- [Класс ProductView](#класс-productview)
		- [Класс ProductPreView](#класс-productpreview)
		- [Класс CartProductsView](#класс-cartproductsview)
		- [Класс CartProductView](#класс-cartproductview)
		- [Класс PaymentFormView](#класс-paymentformview)
		- [Класс ContactsFormView](#класс-contactsformview)
		- [Класс SuccessModalView](#класс-successmodalview)
	- [Слой представления (Presenter)](#слой-представления-presenter)
		- [Класс ProductPresenter](#класс-productpresenter)
		- [Класс CartPresenter](#класс-cartpresenter)
		- [Класс OrderPresenter](#класс-orderpresenter)
	- [Список событий](#список-событий) 
	
## Описание приложения
Интернет-магазин с товарами для веб-разработчиков — Web-ларёк. В нём можно посмотреть каталог товаров, добавить товары в корзину и сделать заказ. 

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с TS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Документация

### Описание данных и их типов

Тип ключей категорий
```
export type categoryKey =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';
```

Объект категорий с явным типом
```
export const productCategory: { [key in categoryKey]: string } = {
	'софт-скил': 'soft',
	другое: 'other',
	дополнительное: 'additional',
	кнопка: 'button',
	'хард-скил': 'hard',
};
```

Интерфейс, описывающий товар
```
export interface IProduct {
	id: string;
	category: string;
	title: string;
	image: string;
	price: number | null;
	description: string;
}
```

Интерфейс, описывающий элемент товар в корзине. 
```
export interface IProductCart {
	id: string;
	price: number;
	title: string;
}
```

Тип описывающий возможные методы оплаты
```
export type paymentMethod = 'card' | 'cash';
```

Интерфейс, описывающий состояние формы
```
export interface IFormState {
	valid: boolean;
	errors: string[];
}
```

Интерфейс, описывающий форму со способом оплаты. Расширяет IFormState
```
export interface IPaymentForm extends IFormState {
	payment: paymentMethod;
	address: string;
	render: (state: Partial<IPaymentForm> & IFormState) => HTMLElement;
}
```

Интерфейс, описывающий форму с контактами пользователя. Расширяет IFormState
```
export interface IContactsForm extends IFormState {
	email: string;
	phone: string;
	render: (state: Partial<IContactsForm> & IFormState) => HTMLElement;
}
```

Интерфейс, описывающий данные товаров в заказе
```
export interface IOrderProducts {
	total: number;
	items: string[];
}
```

Интерфейс, описывающий данные пользователя в заказе. Расширяет IOrderProducts 
```
export interface IOrderData extends IOrderProducts {
	payment: paymentMethod;
	address: string;
	email: string;
	phone: string;
}
```

Тип, описывающий ошибки форм
```
export type FormErrors = Partial<Record<keyof IOrderData, string>>;
```

Тип, описывающий состояние элемента кнопки
```
export type ButtonState = 'Купить' | 'Убрать из корзины';
```

интерфейс данных успешного заказа, получаемого в ответе от сервера на post запрос
```
export interface ISuccessOrder {
	id: string;
	total: number;
}
```

### Описание архитектуры 
Архитектура приложения построена с использованием паттерна MVP.

В приложении выделено 3 слоя, согласно этому паттерну:
1. **Model** — отвечает за хранение и обработку данных, содержит бизнес-логику. 
2. **View** — отвечает за отображение данных, реагирует на действия пользователя.
3. **Presenter** — связующее звено между model и view. Получает данные от view, передает в model для обработки, затем обработанные данные возвращает в view. 

В приложении выделено 3 презентера:
- productPresenter — служит для связи операций с продуктами и моделью
- cartPresenter — служит для связи операций с корзиной и моделью 
- orderPresenter — служит для связи операций с оформлением заказа и моделью

### Базовый код

#### Класс API
Реализует базовую работу с сервером — отправку запросов. 

constructor(baseUrl: string, options: RequestInit = {}) — конструктор принимает базовый адрес сервера и объект опций. 

Методы класса:
- get — позволяет сделать `GET` запрос к серверу по переданному в параметрах конечному пути. Возвращает промис с объектом от сервера.
- post — позволяет сделать `POST` запрос с объектом данных(приводится к JSON) на сервер по переданному в параметрах конечному пути. Метод запроса можно поменять, передав его третим параметром(по умолчанию установлен `POST`).

#### Класс EventEmitter
Выступает в роли брокера событий. Реализует отправку и подписку на события. Класс используется в слое 'Presenter' для обработки событий, а в остальных слоях для генерации событий. 

Основаные методы класса:
- on — создает подписку на событие. Если события нет, создает новое событие.
- off — снимает подписку на событие. Если больше подписок нет, удаляет событие. 
- emit — вызывает события и уведомляет всех подписчиков, передавая необходимые данные.

Расширенные методы класса:
- onAll — подписка на все события.
- offAll — сбрасывает все подписки. 
- trigger — создает колбек, генерирующий событие с переданными данными и контекстом. 

#### Класс Component
Представляет собой асбртактный базовый класс для создания UI-компонетов. 

- constructor(container: HTMLElement) — конструктор принимает и инициализирует контейнер. 

Методы класса для работы с его данными:
- toggleClass(element: HTMLElement, className: string, force?: boolean): void — переключает класс элемента. Опционально можно явно добавить или удалить класс, передав третим параметром булево значение. 
- setText(element: HTMLElement, value: unknown): void — устанавливает в переданный элемент переданное текстовое содержимое. 
- setDisabled(element: HTMLElement, state: boolean): void — устаналивает переданному элементу переданное активное или неактивное состояние.
- setHidden(element: HTMLElement): void — скрывает переданный элемент. 
- setVisible(element: HTMLElement): void — показывает переданный элемент. 
- setImage(element: HTMLImageElement, src: string, alt?: string): устанавливает переданному элементу-картинке переданные ссылку на картинку и альтернативный текст. 
- render(data?: Partial<T>): HTMLElement — отрисовывает компонент. Опционально можно передать данные, которые будут объединены с данными компонента. Возвращает контейнер. 

#### Класс Presenter
Представляет собой асбртактный базовый класс для реализации презентеров. 

3 обязательных параметра передаются в конструктор: модель, брокер событий, модальное окно. Также в конструктор можно передать 3 необязательных класса отображения. Классы отображения могут быть разными, например, корзина товаров или форма оформления заказа. Используется нумерация, т.к. у презентеров нет паттерна принятия аргументами элементов слоя отображения. У презентера есть дженерики: V, V2, V3 - поэтому при реализации класса их нужно уточнить. Например, <IOrderForm, IContactsForm, ISuccessModal>. 

Поля класса для хранения и взаимодействия с его данными:

* protected _events: IEvents;
* protected _model: IAppModel;
* protected _modal: IModal;
* protected _view?: V;
* protected _view2?: V2;
* protected _view3?: V3;

#### Класс AppAPI
Расширяет базовый класс Api. Реализует интерфейс IAppAPI:
```
export interface IAppAPI {
	getProducts: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	postOrder: (orderData: IOrderData) => Promise<ISuccessOrder>;
}
```
Параметр cdn для путей изображений передается параметром в конструктор, а также базовый адрес и объект опций. 

Поля класса для хранения и взаимодействия с его данными:
* readonly cdn: string; 

Методы класса для взаимодействия с его данными:
* getProducts(): Promise<IProduct[]> — метод для получения товаров с сервера.
* getProduct(id: string): Promise<IProduct> — метод для получения данных одной карточки.
* postOrder(order: IOrderData): Promise<ISuccessOrder> — метод для отправки данных заказа на сервер.

### &#10134; Слой данных (Model)

#### Класc AppModel
Реализует интерфейс:

```
export interface IAppModel {
	products: IProduct[];
	cart: IProductCart[];

	addToCart(product: IProductCart): void;
	delFromCart(productId: string): void;
	isInCart(id: string): boolean;
	sendOrder(orderData: IOrderData): Promise<ISuccessOrder>;
	clearCart(): void;
}
```
Инстанты классов AppAPI и EventEmmiter передаются параметрами в конструктор, также вызывается метод initialize().

Поля класса для хранения и взаимодействия с его данными:
* protected AppAPI: IAppAPI 
* protected events: IEvents 
* products: IProduct[] = []
* cart: IProductCart[] = [] 

Методы класса для взаимодействия с его данными:
* private initialize() — метод вызывается в конструкторе и вызывает fetchProducts().
* private fetchProducts(): Promise<IProduct[]> — метод для получения товаров с сервера.
* addToCart(product: IProductCart): void — метод для добавления товара в корзину и в localStorage.
* delFromCart(productId: string): void — метод для удаления товара из корзины и localStorage по переданному id товара.
* private getCart(): void — метод для получения товаров из localStorage и сохранения в переменной cart.
* sendOrder(orderData: IOrderData) — метод для отправки заказа.
* clearCart(): void — метод для очистки корзины и localStorage.
* isInCart(id: string): boolean — метод для проверки нахождения товара в cart. 

### &#10134; Слой отображения (View)
Все классы отображения отвечают за отображение внутри контейнера(DOM-элемент) передаваемых в них данных. 

#### Класс Modal
Расширяет класс Component. Реализует отображение модального окна.\
Устанвливает слушатели для закрытия окна: нажатием клавишы Esc, кликом по оверлею и кликом по кнопке закрытия модального окна.\

Поля класса для хранения и взаимодействия с его данными:
- _closeButton: HTMLButtonElement — кнопка-крестик закрытия модального окна
- _content: HTMLElement — HTML-элемент 

- constructor(container: HTMLElement, events: IEvents) — конструктор принимает контейнер и экземпляр класса `EventEmitter` для инициации событий при изменении данных. 

Методы класса для взаимодействия с его данными:
- set content(value: HTMLElement) — сеттер для установки HTML-элемента.
- open() — метод для отображения модального окна.
- close() — метод для скрытия модального окна.
- render(data: IModalData): HTMLElement — метод для отрисовки модального окна с переданными ему данными. Обеспечивает автоматическое открытие модального окна после отрисовки. 

#### Класс Product
Расширяет класс Component. Реализует отображение товара.\

Поля класса для хранения и взаимодействия с его данными:
- protected _categoryElem: HTMLElement; — элемент с категорией товара.
- protected _titleElem: HTMLElement; — элемент с названием товара.
- protected _imageElem: HTMLImageElement; — элемент с картинкой товара.
- protected _priceElem: HTMLElement; — элемент с ценой товара.
- public product: IProduct;
- events: IEvents; — экземпляр класса `EventEmitter` для инициации событий при изменении данных.


constructor(container: HTMLElement, product: IProduct, events: IEvents) — принимает контейнер, данные продукта и экземпляр класса `EventEmitter`. 

Методы класса для взаимодействия с его данными:
- set category(category: categoryKey) — сеттер для категории товара.
- set title(title: string) — сеттер для названия товара.
- set image(src: string) — сеттер для картинки товара.
- set price(price: number)— сеттер для цены товара.

#### Класс Form
Расширяет класс Component. Реализует формы приложения. Устанавливает слушатели на кнопку submit и на инпуты.\

Поля класса для хранения и взаимодействия с его данными:
- _submit: HTMLButton — элемент кнопки.
- _errors: HTMLElement — элемент ошибки валидации.

constructor(protected container: HTMLFormElement, protected events: IEvents) — принимает контейнер и экзмепляр класса `EventEmitter` и инициализирует их. 

Методы класса для взаимодействия с его данными:
- onInputChange(field: keyof T, value: string) — реагирует на изменения в инпутах формы
- set valid(value: boolean) — сеттер для установки валидности.
- set errors(value: string) — сеттер для установки ошибок.
- render(state: Partial<T> & IFormState) — метод для отрисовки формы.


#### Класс ProductView
Расширяет класс Product. Реализует отображение товара.

В конструкторе устанавливается слушатель событий на товар, при нажатии срабатывает событие product:selected.

#### Класс ProductPreview
Расширяет класс Product. Реализует отображение товара в модальном окне товара.

Конструктор устанавливает слушатель на кнопку 'Купить'.

Поля класса для хранения и взаимодействия с его данными:
- private descriptionElement: HTMLElement;
- private buttonElemenet: HTMLButtonElement;

Методы класса для взаимодействия с его данными:
- set button(buttonText: ButtonState) — сеттер для состояния кнопки 'Купить'.
- set description(description: string) — сеттер для описания товара.

#### Класс CartProductsView
Расширяет класс Component. Реализует отображение корзины с товарами.

Элемент корзины передается параметром в конструктор. Внутри контейнера находятся: listElem, buttonElem, totalPriceElem. На кнопку устанавливается слушатель, вызывающий срабатывание события order:start.

Поля класса для хранения и взаимодействия с его данными:
- private events: IEvents;
- private listElem: HTMLElement;
- private totalPriceElem: HTMLElement;
- private buttonElem: HTMLButtonElement;
- private counterElem: HTMLElement;

Методы класса для взаимодействия с его данными:
- updateView(productsCart: IProductCart[]): void — метод для обновления отображения элементов в корзине при добавлении/удалении товара.
- protected updateTotalPrice(productCart: IProductCart[]) — метод для обновления итоговой цены товаров в корзине при добавлении/удалении товара. 
- protected toggleButton(empty: boolean) — метод для включения/выключения кнопки оформления заказа. Если не корзина не пустая, то кнопка включена.

#### Класс CartProductView
Расширяет класс Component. Реализует отображение товаров в корзине.

Элемент корзины передается параметром в конструктор. Внутри контейнера находятся: indexElem, titleElem, priceElem, buttonElem. На кнопку устанавливается слушатель, вызывающий событие product:delFromCart.

Поля класса для хранения и взаимодействия с его данными:

- events: IEvents;
- private indexElem: HTMLElement;
- private titleElem: HTMLElement;
- private priceElem: HTMLElement;
- private buttonElem: HTMLButtonElement;

Методы класса для взаимодействия с его данными:
- set title(title: string) — сеттер для названия товара
- set index(index: number) — сеттер для индекса товара
- set price(price: number) — сеттер для цены товара

#### Класс PaymentFormView 
Расширяет класс Form. Реализует отображение формы с оплатой и адресом.

Элемент формы и EventEmitter передаются параметром в конструктор. Устанавливается слушатель событий на кнопки выбора способа оплаты.

Поля класса для хранения и взаимодействия с его данными:
- private buttonElems: HTMLButtonElement[];

Методы класса для взаимодействия с его данными:
- set address(value: string) — сеттер для адреса
- set payment(value: paymentMethod) — сеттер для способа оплаты
- private handlePaymentChange(event: Event) — обработчик переключения способа оплаты кнопками.

#### Класс ContactsFormView
Расширяет класс Form. Реализует отображение формы с контактной информацией, почтой и телефоном.

Элемент формы и EventEmitter передаются параметром в конструктор.

Методы класса для взаимодействия с его данными:
- set phone(value: string) — сеттер для номера телефона
- set email(value: string) — сеттер для почты

#### Класс SuccessModalView
Расширяет класс Component. Реализует отображение модального окна
с успешным заказом.

Контейнер и EventEmitter передаются параметром в конструктор.
Внутри находится descriptionElem, buttonElem. Устанавливается слушатель событий на кнопку 'За новыми покупками!'

Поля класса для хранения и взаимодействия с его данными:
- private descriptionElem: HTMLElement;
- private buttonElem: HTMLButtonElement;
- private events: IEvents;

Методы класса для взаимодействия с его данными:
- set total(total: string)  — сеттер для итоговой стоимости заказа в descriptionElem.

### &#10134; Слой представления (Presenter)

#### Класс ProductPresenter
Расширяет класс Presenter. Реализует презентре для связи AppModel и ProductView.

Инстанты классов AppModel и Modal, EventEmitter передаются параметрами в конструктор и инициализируются.

Методы класса для взаимодействия с его данными:
- loadProducts(): void — метод создания товара и его отображения, срабатывающий при событии products:fetched.
- handleOpenModal(product: IProduct): void — метод для передачи данных выбранного товара в модальное окно товара и в модель.

#### Класс CartPresenter
Расширяет класс Presenter. Реализует презентер для связи AppModel и CartProductsView. 

Инстанты классов AppModel и EventEmitter, Modal и CartProductsView передаются параметрами в конструктор.

Методы класса для взаимодействия с его данными:
- handleAddToCart(product: IProductCart): void — метод для добавления товара в корзину, передачи данных в модель и вызова метода обновления отображения.
- handleDelFromCart(id: string): void — метод для удаления товара из корзины по переданному id, передачи данных в модель и вызова метода обновления отображения. 
- handleOpenModal() — метод для открытия модального окна корзины
- handleUpdateView() — метод для обновления отображения корзины

#### Класс OrderPresenter
Расширяет класс Presenter. Реализует презентер для связи AppModel, PaymentFormView, ContactsFormView. 

AppModel, EventEmitter, Modal, PaymentFormView, ContactsFormView и SuccessModalView передаются параметрами в конструктор. 

Поля класса для хранения и взаимодействия с его данными:
-	private orderDetails: IOrderData;
- private formErrors: FormErrors = {};

Методы класса для взаимодействия с его данными:
- handleOpenPaymentForm() — метод для открытия модального окна формы оплаты
- handleOpenContactsForm() — метод для открытия модального окна формы контактной информации
- handleChangeInput<K extends keyof IOrderData> — устанавливает значения из формы в переменную orderDetails
- validateOrder() — метод для валидации формы и установки ошибок
- handleErrors(errors: Partial<IOrderData>) — метод для передачи текста ошибок
- handleSendOrderDetails() — метод для отправки данных заказа на сервер через метод модели, а также вызова метода очистки корзины
- handleClearCart() — метод для очистки корзины

### Список событий 

- `products:fetched` — срабатывает при разрешении промиса, который загружает товары с сервера. В ProductPresenter используются загруженные данные для последующего отображения.
- `product:selected` — срабатывает при выборе конкретного товара. Передает в AppModel данные выбранного товара, открывает модальное окно товара.
- `product:addToCart` — срабатывает при добавлении товара в корзину кнопкой. Добавляет элемент товара в корзину и обновляет элементы товаров в корзине в модели. 
- `product:delFromCart` — срабатывает при удалении товара из корзины кнопкой. Удаляет элемент товара из корзины и обновляет элементы товаров в корзине в модели. 
- `modal:open` — срабатывает при открытии модального окна, блокируется страница.
- `modal:close` — срабатывает при закрытии модального окна, страница разблокируется.
- `order:start` — срабатывает при оформлении заказа нажатием кнопки в корзине. Открыват модальное окно с формой способа оплаты и адресом. 
- `order:submit` — срабатывает при заполенной формы со способом оплаты и адресом, переходом к форме с контактной информацией нажатием кнопки. 
- `contacts:submit` — срабатывает при заполенной формы с контактной информацией нажатием кнопки. Данные заказа отправляются на сервер.
- `form:submit` — срабатывает при положительном ответе сервера, открывая модальное окно успешного заказа.
- `order:done` — срабатывает при переходе на главную страницу нажатием кнопки, очищая данные корзины в модели и localStorage.
- `formErrorsChange` — срабатывает при возникновении ошибок валидации в формах, отображая тексты ошибок.
- `/^(order|contacts)\..*:change$/` — срабатывает при изменении значений в инпутах форм. 