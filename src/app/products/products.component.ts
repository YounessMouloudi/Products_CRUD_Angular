import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  
  // products : Array<Product> | undefined;
  products! : Array<Product>
  errorMessage : string = "";
  searchForm! : FormGroup;
  currentPage : number = 0;
  pageSize : number = 5;
  totalPages : number = 0; 
  currentAction : string = "all";
  selectedProducts : Product[] = [];
  selectMode : boolean = false;
  selection : string = "all";
  pageSelectModes: boolean[] = [];
  selectedProductsByPage: { [page: number]: Product[] } = {};


  /* pour utiliser un service on doit l'injecter et pour l'injecter on doit le déclarer dans le constructeur => c'est 
  ça l'injection de dépendances */
  constructor(private productService : ProductService,private formBuilder : FormBuilder,
    public authService : AuthenticationService, private router : Router) { }

  ngOnInit(): void {
    
    // hna hadi li kona dayrin 9bal mandiro observable aprés wlat this.handleGetAllProducts()
    // this.products = this.productService.getAllProducts();
    
    // hna aprés ma derna pageProduct alors getAllProducts mab9a 3ndha ta dawr 
    // this.handleGetAllProducts();

    this.handleGetPageProducts();


    // hna khdemna b Two Binding b sti3mal Reactive Forms
    this.searchForm = this.formBuilder.group({
      // hna tandiro les champs li bghina ncherchiw bihom => hna 3ndna ghi champ wahd
      keyword : this.formBuilder.control(null)
    })
  }

  // handleGetAllProducts() {
  //   this.productService.getAllProducts().subscribe({
  //     next : (data) => {
  //       this.products = data;
  //     },
  //     error : (err) => {
  //       this.errorMessage = err
  //     }
  //   });
  // }

  handleGetPageProducts() {

    this.productService.getPageProducts(this.currentPage,this.pageSize).subscribe({

      next : (data) => { // hna data ghatkon objet de type PageProduct

        this.products = data.products;
        this.totalPages = data.totalPages;
        
        this.products.forEach(p => {
          if(p.selected == undefined){
            p.selected = false
          }

        });
      },
      error : (err) => {
        this.errorMessage = err;
      }
    })
  }
    
  handleDeleteProduct(p : any) {
    
    /*  
      let index = this.products.indexOf(p);
      this.products.splice(index,1);

      hna 3tinaha l index dial product w ghadi ndiro splice l la liste bach y7ayed lina had lproduct ay delete
      hadak 1 howa nombre ch7al bghina n7aydo mn la liste => hadchi li kona dayrin 9bal mankhadmo b sevice
    */

    let confirm = window.confirm("Are you sure you want to delete this product ?");
    if(confirm){
      this.productService.deleteProduct(p.id).subscribe({
        next : () => {
  
          // this.handleGetAllProducts();
          /* hna mnin tansupprimiw l product tan3awdo n rechargiw la liste kamla b la méthode handleGetAllProducts() 
          w hadchi f performance c'est lourd alors que khassna nsupprimiw gir dik la ligne bo7edha mn la partie front 
          w hadchi li ghadi n3awdo ndiroh b l index w splice */
          
          let index = this.products.indexOf(p);
          this.products.splice(index,1);
          
          /* hna kan dwa lina 3la had l9adia dial 3lach tansupprimiw b l'index w matansupprimiwch direct b chi fonction 
            galik tandiro haka hit ba3d lmerat taykon 3ndna f front ghir copie dial les données mn l base donnée ay 
            wakha ytsupprima mn lbase donnée ghayb9a yban 3ndna f affichage hit khdamin ghir b copie ay dak l product li
            f l'affichage machi meme reference m3a li f BD w haka tandiro had tari9a d index nsupprimiw donné mn front

            w ila kona khdamin b une copie dial BD li gal maghadich nkono ta returniw f service f métho getAllProducts()
            return of(this.products) nichan   ghadi n returniw hadi => return of([...this.products])
          */
        },
        error : (err) => {
          this.errorMessage = err;
        }
      })
    }
  }

  handleChangePromo(p: Product) {

    let promo = p.promotion;

    this.productService.changePromo(p.id).subscribe({
      next : () => {
        p.promotion = !promo;
      },
      error : (err) => {
        this.errorMessage = err;
      }
    })
  }

  handleSearchProducts(){
    let keyword = this.searchForm.value.keyword

    /* hadi li kant 9bal mandiro l pagination */
    // this.productService.searchProducts(keyword).subscribe({
    //   next : (data) => {
    //     this.products = data;
    //   }
    // })
    
    this.currentAction = "search";
    this.currentPage = 0;

    this.productService.searchProducts(keyword,this.currentPage,this.pageSize).subscribe({
      next : (data) => {
        this.products = data.products;
        this.totalPages = data.totalPages

      }
    })
  }

  goToPage(page : number) {
    this.currentPage = page;

    // hna hadi hia bach ghadi yb9a m7afed 3la selectMode w selectProducts dial kol page  
    if (this.pageSelectModes[page] != undefined && this.selectedProductsByPage[page]) {
      this.selectMode = this.pageSelectModes[this.currentPage];
      this.selectedProducts = this.selectedProductsByPage[page];

    } else {
        this.selectMode = false;
        this.selectedProducts = [];
    }

    console.log(this.selectedProducts);
    
    /* hna mnin kona tandiro l pagination f rechreche kan tay3awd y3tina pagination dial l page kamla alors bach n7alo
    had lmochkil zdna had l currentAction bach ila kan all y3tina pagination dial page kamla sinon ghay3tina l 
    pagination ghi dial recherche */
    if(this.currentAction == "all") {
      this.handleGetPageProducts();
    }
    else {
      this.handleSearchProducts();
    }
  }

  handleEditProduct(id:string){
    this.router.navigateByUrl("dashboard/admin/edit-product/"+id);
  }

  /* hna drna hadi bach n selectioniw un product ay checked => ila checkina l product 
  ghadi y ajoutih f la liste selectedProducts sinon ila rdina check false ghadi y7ayed dak lproduct mn la 
  liste */
  select(p: Product) {

    if(p.selected == undefined || p.selected == false){
      p.selected = true;
      this.selectedProducts.push(p);
    } 
    else {
      p.selected = false;
      let index = this.selectedProducts.indexOf(p);
      this.selectedProducts.splice(index,1);
    }
  }

  /* hna hadi ghadi n selectionniw biha ga3 les products ghir li 3ndna f la page machi ga3 l products li f la 
  liste w ghadi n ajoutiwhom f liste selectedProducts mais 3la 7ssab lmode d selection li 3tinah => il a kan 
  lmode "all" ghadi ytchecké tous les products d la page w ila kan lmode "promo" ghadi ytchecké ghir les products 
  li fihom l promotion */
  setSelection(mode : boolean) {

    this.selectMode = mode;
    this.selectedProducts = [];

    
    this.products.forEach(p=>{
      
      if(this.selection == 'all'){
        p.selected = this.selectMode;
      } 
      else if(this.selection == 'promo'){
        if(p.promotion == true){
          p.selected = this.selectMode
        } 
        else {
          p.selected = false;
        }
      }

      if(p.selected == true) {
        this.selectedProducts.push(p);
      } 
      else {
        let index=this.selectedProducts.indexOf(p);
        this.selectedProducts.splice(index,1);
      }

    });

    /* hna drna 2 variables whda boolean w li hia => this.pageSelectModes[this.currentPage] w li ghanstokiw 
    fiha mode (ay selectMode) dial l current page w lakhra de type Product[] w li ghadi nstokiw fiha les 
    products li t selectionnaw f dik la page ay f current page */ 
    this.pageSelectModes[this.currentPage] = mode;
    this.selectedProductsByPage[this.currentPage] = this.selectedProducts;
  }

  /* hna ghadi nsupprimiw ghir les products li selectionnina (li checkina) ghir li f la page current */
  handleDeleteSelection() {
    this.productService.deleteListProducts(this.selectedProducts).subscribe({
      next : () => {

        for(let p of this.selectedProducts) {
          let index = this.products.indexOf(p);
          this.products.splice(index,1);
        }
        this.pageSelectModes[this.currentPage] = false;
        this.selectedProductsByPage[this.currentPage] = [];
      },
      error : (err) => {
        this.errorMessage = err;
      }
    })

  }

  /* hna ghadi nbadlo l promotion l ga3 l products li chéckina mais ghir li f la page actuelle => ay ghadi nrado
  ga3 les products fihom promotion */
  handleSetPromotion() {
    this.productService.setPromoForProducts(this.selectedProducts).subscribe({
      next : () => {
        this.selectedProducts.forEach( p => p.promotion = true)
      },
      error : (err) => {
        this.errorMessage = err;
      }
    })
  }

}
