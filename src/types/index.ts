// Алиасы простых типов для товара
export type productId = string;
export type productTitle = string;
export type productImg = string;
export type productPrice = number | null;
export type productDesc = string;
export type cartState = boolean;
export type productCanBuy = boolean;
export type productSerialNumber = number;

// перечисляемый тип, описывающий возможные категории товара
export enum productCategory {
  soft = 'софт-скил',
  other = 'другое',
  additional = 'дополнительное',
  button = 'кнопка',
  hard = 'хард-скил'
}

// интерфейс, описывающий товар
export interface IProduct {
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

// интерфейс, описывающий товар в приложении, расширяет итерфейс товара
export interface IProductApp extends IProduct {
  cartState: cartState; // есть в корзине? 
  canBuy: productCanBuy; // доступен для покупки? для отключения возможности купить товар с ценной = "Бесценно"
  serialNumber: productSerialNumber | null; // для порядкового номера в корзине

  setCartState(product: IProduct): cartState;
  setCanBuy(product: IProduct): productCanBuy;
  setSerialNumber(product: IProduct): productSerialNumber;
}

// class Obj implements IProduct {

//   id: productId;
//   category: productCategory;
//   title: productTitle;
//   image: productImg;
//   price: productPrice;
//   description: productDesc;
//   isCart: isCart; // есть в корзине? 
//   canBuy: productCanBuy; // доступен для покупки? для отключения возможности купить товар с ценной = "Бесценно"
//   serialNumber: productSerialNumber | null; // для порядкового номера в корзине

//   constructor(product: IProduct) {
//     this.id = product.id;
//     this.category = product.category;
//     this.title = product.title;
//     this.price = product.price;
//     this.description = product.description;
//   }
//   setIsCart(product: IProduct): isCart {
//     return this.isCart = false;
//   };
//   setCanBuy(product: IProduct): productCanBuy {
//     if(this.price === null) {
//       return this.canBuy = false;
//     }
//     return this.canBuy = true;
//   };
//   setSerialNumber(product: IProduct): productSerialNumber {
//     return this.serialNumber = 0;
//   };
// }

// интерфейс, описывающий каталог товаров
export interface IProductsData {
  productsList: IProduct[];
  preview: productId | null;

  getProduct(id: productId): IProduct;
  toogleIsCart(id: productId): void; // переключение состояния 'Купить' | 'Убрать из корзины'
}

// интерфейс, описывающий корзину
export interface ICartData {
  productsList: TProductCart[];
  totalPrice: number;

  addProduct(productId: productId): TProductCart[];
  delProduct(productId: productId): TProductCart[];
  resetCart(): void;
  getProductList(): TProductCart[];
  setTotalPrice(products: TProductCart[]): number; 
  getTotalPrice(products: TProductCart[]): number;   
}

// Алиасы простых типов для заказа
export type orderPaymentMethod = 'online' | 'cash'; // тип, описывающий метод оплаты
export type orderAddress = string;
export type orderEmail = string;
export type orderPhone = string;
export type orderTotalPrice = number;
export type orderItems = string[];

// интерфейс, описывающий заказ
export interface IOrder {
  payment: orderPaymentMethod;
  address: orderAddress;
  email: orderEmail;
  phone: orderPhone;
  total: orderTotalPrice;
  items: orderItems;
}

// интерфейс, описывающий данные заказа и логику работы с ними
export interface IOrderData extends IOrder {
  setOrderInfo(orderData: IOrderData): void;
  getOrderInfo(): IOrder;
  checkValidation(data: Record<keyof TOrderPaymentAndAdress & TOrderEmailAndPhone, string>): boolean;
  resetOrder(order: IOrder): void;
}

// тип, описывающий товар в каталоге на главной
export type TProductCatalog = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>;

// тип, описывающий товар в модальном окне товара
export type TProductModal = Pick<IProduct, 'category' | 'title' | 'description' | 'image' | 'price' | 'cartState' | 'canBuy'>;

// тип, описывающий товар в модальном окне корзины
export type TProductCart = Pick<IProduct, 'serialNumber' | 'title' | 'price'>;

// тип, описывающий заказ в модальном окне с методом оплаты и адресом
export type TOrderPaymentAndAdress = Pick<IOrder, 'payment' | 'address'>;

// тип, описывающий заказ в модальном окне с почтой и телефоном
export type TOrderEmailAndPhone = Pick<IOrder, 'email' | 'phone'>;

// тип, описывающий заказ в модальном окне успешной покупки
export type TOrderSuccess = Pick<IOrder, 'total'>;

export interface IOrderSuccess {
  id: string;
  total: number;
}

export interface IOrderError {
  error: string;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}