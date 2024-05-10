# Проектная работа "Веб-ларек"

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

## Описание данных и их типов

Алиасы простых типов данных товара
```
export type productId = string;
export type productTitle = string;
export type productImg = string;
export type productPrice = number | null;
export type productDesc = string;
export type cartState = boolean;
export type productCanBuy = boolean;
export type productSerialNumber = number;
```

Перечисляемый тип, описывающий возможные категории товара
```
export enum productCategory {
  soft = 'софт-скил',
  other = 'другое',
  additional = 'дополнительное',
  button = 'кнопка',
  hard = 'хард-скил'
}
```

Интерфейс, описывающий товар
```
export interface ICard {
  id: productId;
  category: string;
  title: productTitle;
  image: productImg;
  price: productPrice;
  description: productDesc;
  cartState?: cartState;
  canBuy?: productCanBuy;
  serialNumber?: productSerialNumber | null;
}
```

Интерфейс, описывающий **товар, для работы в приложении**. Расширяет интерфейс товара, полученного с сервера
```
interface IProductLarek extends IProduct {
  isCart: isCart;
  canBuy: productCanBuy; 
  serialNumber: productSerialNumber | null; 
  setIsCart(product: IProduct): isCart;
  setCanBuy(product: IProduct): productCanBuy;
  setSerialNumber(product: IProduct): productSerialNumber;
}
```

Интерфейс, описывающий **каталог товаров**
```
export interface IProductsData {
  productsList: IProductLarek[];
  preview: productId | null;

  getProduct(id: productId): IProductApp;
  toogleIsCart(productId: productId): void; 
}
```

Алиасы простых типов для заказа
```
type orderPaymentMethod = 'online' | 'cash'; 
type orderAdress = string;
type orderEmail = string;
type orderPhone = string;
type orderTotalPrice = number;
type orderItems = string[];
```

Интерфейс, описывающий **товары в корзине**
```
export interface ICart {
  productsList: TCardCart[];
  totalPrice: number;

  addCard(cardId: cardId): TCardCart[];
  delCard(cardId: cardId): TCardCart[];
  resetCart(cart: ICart): void;
}
```

Интерфейс, описывающий **заказ**
```
export interface IOrder {
  payment: orderPaymentMethod;
  adress: orderAdress;
  email: orderEmail;
  phone: orderPhone;
  totalPrice: orderTotalPrice;
  itemsList: orderItems;
}
```

Интерфейс для работы с данными заказа
```
export interface IOrderData {
  setOrderInfo(orderData: IOrder): IOrder;
  checkValidation(data: Record<keyof TFormPaymentAndAdress & TFormEmailAndPhone, string>): boolean;
}
```

Данные товара в каталоге на главной
```
export type TProductCatalog = Pick<IProductApp, 'category' | 'title' | 'image' | 'price'>;
```

Данные товара в модальном окне самого товара
```
export type TProductModal = Pick<IProductApp, 'category' | 'title' | 'description' | 'image' | 'price' | 'isCart' | 'canBuy'>;
```

Данные товара в модальном окне корзины
```
export type TProductCart = Pick<IProductApp, 'serialNumber' | 'title' | 'price'>;
```

Данные заказа в модальном окне с методом оплаты и адресом
```
export type TOrderPaymentAndAdress = Pick<IOrder, 'payment' | 'adress'>;
```

Данные заказа в модальном окне с почтой и телефоном
```
export type TOrderEmailAndPhone = Pick<IOrder, 'email' | 'phone'>
```

Данные заказа в модальном окне успешной покупки
```
export type TOrderSuccess = Pick<IOrder, 'totalPrice'>
```

## Описание архитектуры 
Архитектура приложения построена с использованием паттерна MVP.

В приложении выделено 3 слоя, согласно этому паттерну:
1. **Model** — отвечает за хранение и обработку данных, содержит бизнес-логику. 
2. **View** — отвечает за отображение данных, реагирует на действия пользователя.
3. **Presenter** — связующее звено между model и view. Получает данные от view, передает в model для обработки, затем обработанные данные возвращает в view. 

## Базовый код

### Класс API
Реализует базовую работу с сервером — отправку запросов. В конструктор передается базовый адрес сервера и объект опций. 

Методы класса:
- get — позволяет сделать `GET` запрос к серверу по переданному в параметрах конечному пути. Возвращает промис с объектом от сервера.
- post — позволяет сделать `POST` запрос с объектом данных(приводится к JSON) на сервер по переданному в параметрах конечному пути. Метод запроса можно поменять, передав его третим параметром(по умолчанию установлен `POST`).

### Класс EventEmitter
Выступает в роли брокера событий. Реализует отправку и подписку на события. Класс используется в слое 'Presenter' для обработки событий, а в остальных слоях для генерации событий. 

Основаные методы класса:
- on — создает подписку на событие. Если события нет, создает новое событие.
- off — снимает подписку на событие. Если больше подписок нет, удаляет событие. 
- emit — вызывает события и уведомляет всех подписчиков, передавая необходимые данные.

Расширенные методы класса:
- onAll — подписка на все события.
- offAll — сбрасывает все подписки. 
- trigger — создает колбек, генерирующий событие с переданными данными и контекстом. 

### Класс Component
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

## Слой данных (Model)

### Класc ProductsData
Отвечает за хранение товаров в каталоге товаров и логику работы с их данными.

Поля класса для хранения и взаимодействия с его данными:
* _productsList: IProductApp[] — массив объектов товаров.
* _preview: productId | null — id товара, выбранного для просмотра в модальном окне товара.
* events: IEvents — экземпляр класса `EventEmitter` для инициации событий при изменении данных.

constructor(events: IEvents) — истант брокера событий передается параметром в конструктор.

Методы класса для взаимодействия с его данными:
* set productList(products: IProductApp[]) — сеттер для установки переданного массива товаров.
* get productsList() — геттер для получения массива товаров в каталоге. 
* set preview(id: productId) — сеттер для установки переданного id продукта.
* get preview() — геттер для получения id продукта.

* getProduct(id: productId): IProductApp — метод для получения товара по его id. 
* toogleIsCart(id: productId): void — переключает состояние нахождения товара в корзине. Вызывает событие изменения массива. 

### Класс CartData
Отвечает за хранение данных товаров в корзине и логику работы с этими данными.

Поля класса для хранения и взаимодействия с его данными:

- _productsList: IProductApp[] — массив товаров в корзине.
- _totalPrice: number | null — итоговая цена товаров.

constructor(events: IEvents) — истант брокера событий передается параметром в конструктор.

Методы класса для взаимодействия с его данными:
- set productsList(productsList: IProductApp[]) — сеттер для установки массива товаров корзины.
- get productList() — геттер для получения массива товаров корзины.
- set totalPrice(products: TProductCart[]) — сеттер для установки итоговой цены товаров корзины.
- get totalPrice() — геттер для получения итоговой цены товаров корзины.
- addProduct(id: productId): TProductCart[] — метод для добавления товара в конец массива товаров корзины.
- delProduct(id: productId): TCardCart[] — метод для удаления товара из массива товаров корзины.
- resetCart(): void — метод для очистки массива товаров корзины и итоговой стоимости. 

### Класс OrderData
Отвечает за хранение данных заказа и логику работы с этими данными.

Поля класса для хранения и взаимодействия с его данными:

- payment: orderPaymentMethod — метод оплаты.
- adress: orderAdress — адрес доставки.
- email: orderEmail — почта. 
- phone: orderPhone — телефон.
- total: orderTotalPrice — итоговая цена заказа.
- itemsList: orderItems — массив товаров заказа. 

constructor(events: IEvents) — истант брокера событий передается параметром в конструктор.

Методы класса для взаимодействия с его данными:
- setOrderData(orderData: IOrderData): void — метод для установки данных заказа, получаемых объектом в параметр. 
- getOrderData(): IOrder — геттер для получения данных заказа.
<!-- - checkValidation(data: Record<keyof TOrderPaymentAndAdress & TOrderEmailAndPhone, string>): boolean — валидация указанных данных. -->
- validateOrder(): boolean — метод для валидации данных заказа.
- resetOrder(order: IOrder): void — сброс данных заказа.

## Слой отображения (View)
Все классы отображения отвечают за отображение внутри контейнера(DOM-элемент) передаваемых в них данных. 

### Класс Modal
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

### Класс Card
Расширяет класс Component. Реализует отображение карточки товара.\

Поля класса для хранения и взаимодействия с его данными:
- product: IProductLarek;
- categoryElement: HTMLElement — элемент с категорией товара.
- titleElement: HTMLElement — элемент с названием товара.
- imageElement: HTMLElement — элемент с картинкой товара.
- priceElement: HTMLElement — элемент с ценой товара.
- events: IEvent — экземпляр класса `EventEmitter` для инициации событий при изменении данных.

constructor(container: HTMLElement, product: IProductLarek, events: IEvents) — принимает контейнер-темплейт, данные продукта и экземпляр класса `EventEmitter`. 

Методы класса для взаимодействия с его данными:
- setData(productData: IProductLarek): void — заполняет атрибуты элементов карточки переданными данными товара.
- render(): HTMLElement — .

### Класс ProductLarek 
Расширяет класс Product. Реализует карточку товара, используемую в приложении.\

Поля класса для хранения и взаимодействия с его данными:

### Класс Form
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

### Класс OrderPayment
Расширяет класс Form. Реализует первую форму заказа с полями метод оплаты и адрес. 

constructor(container: HTMLFormElement, events: IEvents) — принимает элемент формы и экзмепляр класса `EventEmitter`, передает их в конструктор родительского класса.
Устанавливает слушатели на кнопки способа оплаты. 

Методы класса для взаимодействия с его данными:
- set payment(value: orderPaymentMethod) — сеттер для установки способа оплаты.
- set adress(value: orderAdress) — сеттер для установки адреса.
- handlePaymentChange(event: IEvent) — метод для отслеживания нажатия кнопок способа оплаты. 

### Класс OrderContacts
Расширяет класс Form. Реализует вторую форму заказа с полями email и телефон. 

constructor(container: HTMLFormElement, events: IEvents) — принимает элемент формы и экзмепляр класса `EventEmitter`, передает их в конструктор родительского класса.
Устанавливает слушатель на кнопку оплаты. 

Методы класса для взаимодействия с его данными:
- set email(email: orderEmail): void — сеттер для установки почты.
- set phone(phone: orderPhone): void — сеттер для номера телефона. 

### Класс OrderSuccess
Расширяет класс Component. Реализует компонент модального окна успешного заказа.\ 

Поля класса для хранения и взаимодействия с его данными:
descriptionElement: HTMLElement — описание успешного заказа с итоговой стоимостью. 

constructor(container: HTMLElement, events: IEvents) — принимает контейнер и экзмепляр класса `EventEmitter`, передает их в конструктор родительского класса.

Методы класса для взаимодействия с его данными:
- setTotalPrice(totalPrice: orderTotalPrice) — устанавливает итоговую стоимость заказа в элемент описания.

## Слой представления (Presenter)

### Класс AppAPI
Принимает в конструктор экземпляр класса API и предоставляет методы для работы с бекендом приложения. 

### Взаимодействие компонентов
Код, описывающий взаимодействие слоев `view` и `modal`, находится в файле *index.ts*, выполняет роль слоя `presenter`. 
Взаимодействие осуществляется с помощью событий, генерируемых брокером событий и обработчиков этих событий, находящихся в *index.ts*
В *index.ts* создаются экземпляры всех необходимых классов, затем настраивается обработка событий. 

Список событий

События изменения данных (генерируются классами слоя `Model`)
- `products: changed` — изменение массива товаров
- `product: selected` — изменение карточки продукта в модальном окне карточки продукта
- `cart: changed` — изменение массива товаров корзины
- `order: saved` — сохранение данных заказа 
- `order: sent` — отправлен заказ на сервер

События, возникающие при взаимодействии пользователя с UI (генерируются классами слоя `View`)

- `product: open` — открытие модального окна одной карточки
- `product: addToCart`— добавление товара в корзину и обновление элементов корзины
- `product: delFromCart` — удаление товара из корзины и обновление элементов корзины
- `order: start` — открытие модального окна с формой метод оплаты и адрес
- `order: continue` — открытие модального окна с формой почта и телефон
- `order: sucess` — открытие модального окна успешного заказа
- `cart: open` — открытие модального окна корзины
- `paymentMethod: selected` — выбор способа оплаты
- `formPayment: input` — изменение данных в форме оплаты
- `formContacts: input` — изменение данных в форме контактов
- `formPayment: submit` — сохранение данных пользователя в форме оплаты
- `formContacts: submit` — сохранение данных пользователя в форме контактов
- `formPayment: validation` — проверка валидности всех полей в форме оплаты
- `formContacts: validation` — проверка валидности всех полей в форме контактов
- `formErrors: changed` - измнение объекта ошибок валидации
- `success: toMain` — открытие главной страницы кнопкой в модальном окне успешного заказа, очистка полей формы, очистка корзины