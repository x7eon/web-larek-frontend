import { IEvents } from './base/events';
import {

  IProduct,
	productId,
	productTitle,
	productImg,
	productPrice,
	productDesc,
	cartState,
	productCanBuy,
	productSerialNumber,
  TProductModal,
} from '../types/index';

// по идее нужно написать метод в классе ProductsData, который будет получать массив карточек с сервера и преобразовывать его в новый массив, содержащий дополнительные поля: cartState, canBuy

// @todo Понять, где прописывать этот интерфейс. Здесь, или экспортировать его из index.ts?
interface IProductsData {
  productsList: IProduct[];
  preview: productId | null;

  getProduct(id: productId): IProduct;
  toogleCartState(id: productId): void; // переключение состояния 'Купить' | 'Убрать из корзины'
}

export class ProductsData implements IProductsData {
	protected _productsList: IProduct[];
	protected _preview: productId | null;
	protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this._preview = null;
  }

	set productsList(products: IProduct[]) {
    this._productsList = products;
    this.events.emit('products: changed');
  }

	get productsList(): IProduct[] {
    return this._productsList;
  };

  set preview(id: productId) {
    this._preview = id;
  }

  get preview() {
    return this._preview;
  }

	getProduct(id: productId): IProduct {
    return this._productsList.find(product => product.id === id);
  };

	toogleCartState(id: productId): void {
    const product = this._productsList.find(product => product.id === id);
    if (product) {
      product.cartState = !product.cartState;
      this.events.emit('products: changed');
    }
  };
}

