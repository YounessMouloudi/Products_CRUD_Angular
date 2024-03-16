import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { PageProduct, Product } from '../model/product.model';
import { ValidationErrors } from '@angular/forms';

/* had decoration injectable tat3ni ana had service ymkan lina n injectiwh f ayi blass f projet 

had providedIn : root tat3ni ana had service mdéclari f root ay n9adro n utilisiwah f application kamla hit ila 
makantch hadi kan ghadi ykhassna darori ndéclariwh f app.modules.ts f la partie providers 3ad bach n9adro nsta3mloh 
*/

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // private products! : Product[];
  private products! : Array<Product>;

  constructor() {

    this.products = [
      {id : UUID.UUID() , name : "Computer", price : 5500, promotion : true},
      {id : UUID.UUID() , name : "Printer", price : 3500, promotion : false},
      {id : UUID.UUID() , name : "Smart Phone", price : 6500, promotion : true},
      {id : UUID.UUID() , name : "Laser", price : 1500, promotion : false},
    ]

    for (let i = 1; i < 11; i++) {
      this.products.push( {id : UUID.UUID() , name : "Computer"+i, price : 5500+(i*20), promotion : true} );
      this.products.push( {id : UUID.UUID() , name : "Laser"+i, price : 1500+(i*50), promotion : false} );
    }
  }

  /* had tari9a li drna bach tanjibo les products hia li tatssma impérative programming ay synchrone ay khassna 
    ntssnaw les données yjiwna 3ad n9adro ndiro chi action akhra alors que angular machi haka taykhdam il utilise 
    reactive programming (asynchrone) ay 3iwad nraj3o liste de products ghadi nraj3o un object de type observable 

    public getAllProducts() {
      return this.products;
    }
  */

  // hna ima n utilisiw Array<Product> or Product[]
  public getAllProducts() : Observable<Product[]> {

    // let rand = Math.random();
    // if(rand < 0.5) {
    //   return throwError(() => new Error("Internet Connexion Error"));
    // }
    // else {
    //   return of(this.products);
    // }

    return of(this.products);
  }

  public getPageProducts(page:number,size: number) : Observable<PageProduct> {

    let index = page * size;

    let totalPages = ~~(this.products.length / size); 
    // hado "~~"" f la division tat3tina une division entière ay resultat bla virgule 
    
    if(this.products.length % size != 0){
      totalPages++;
    }

    let pageProducts = this.products.slice(index,index+size);

    return of({products : pageProducts, page : page, size : size, totalPages : totalPages});
  }

  public deleteProduct(id : string) : Observable<boolean> {
    this.products = this.products.filter(p => p.id != id);
    return of(true);
  }

  public changePromo(id : string) : Observable<boolean> {
    let product = this.products.find(p => p.id == id);

    if(product) {
      product.promotion = !product.promotion;
      return of(true);
    }
    else{
      return throwError(() => new Error("Product not Found"));
    }

  }

  /* hadi hia la methode li kona tan recherchiw biha 9bal mandiro l pagination w db drna liha modification w zdna liha 
  lpagination */
  // public searchProducts(keyword : string) : Observable<Product[]> {

  //   let products = this.products.filter(p => p.name.includes(keyword));

  //   return of(products);
  // }

  public searchProducts(keyword : string, page:number, size: number) : Observable<PageProduct> {

    let result = this.products.filter(p => p.name.includes(keyword));

    let index = page * size;

    let totalPages = ~~(result.length / size);
    
    if(this.products.length % size != 0){
      totalPages++;
    }

    let pageProducts = result.slice(index,index+size);

    return of({products : pageProducts, page: page, size : size, totalPages : totalPages});
  }

  public saveProduct(product : Product) : Observable<Product> {

    product.id = UUID.UUID();
    this.products.push(product);
    
    return of(product);
  }

  public getProduct(id : string) : Observable<Product> {

    let product = this.products.find(p => p.id == id);

    if(product) {
      return of(product);
    }
    else {
      return throwError(() => new Error("Product not Found"));
    }
  }

  public getErrorMessage(fieldName : string, error : ValidationErrors){
    if(error["required"]){
      return fieldName + " is required";
    }
    else if (error["minlength"]){
      return fieldName + " should have at least " + error["minlength"]["requiredLength"] + " characters";
    }
    else if (error["min"]){
      return fieldName + " should have min value  " + error["min"]["min"];
    }
    else {
      return "";
    }
  }

  public updateProduct(product : Product) : Observable<Product> {
    /* hna ghadi nmapiw 3la la liste products w ghandiro une condition si la condition est true ghadi n 
    n remplaciw (càd écraser) l product b nv product ay update sinon ghadi yb9a l product actuel kima howa */
    this.products = this.products.map(p => (p.id == product.id) ? product : p)
    return of(product);
  }

  public deleteListProducts(products : Product[]) : Observable<boolean> {
    this.products = this.products.filter(prod => products.find( p => p.id == prod.id ) == null );
    
    return of(true);
  }

  public setPromoForProducts(products : Product[]) : Observable<boolean> {
    let prods = this.products.filter( p => products.find( product => product.id == p.id ) != null);
    prods.forEach( p => {
      p.promotion=true;
    });

    return of(true);
  }

}
