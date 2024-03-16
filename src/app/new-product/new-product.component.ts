import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  
  newProductForm! : FormGroup;
  errorMessage : string = "";

  constructor(private fb : FormBuilder, public productService : ProductService,private router :Router) { }

  ngOnInit(): void {

    this.newProductForm = this.fb.group({
      // hna zdna validations 3la les champs
      name : this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      price : this.fb.control(0, [Validators.required, Validators.min(100)]),
      promotion : this.fb.control(false)
    })
  }

  handleAddProduct() {
    // console.log(this.newProductForm.value)

    let product = this.newProductForm.value;
    this.productService.saveProduct(product).subscribe({
      next : () => {
        alert("Product Added Successfully");
        this.newProductForm.reset(); // hadi ghadi tdir reset l formulaire 
        this.router.navigateByUrl("/dashboard/products");
      },
      error : (err) => {
        this.errorMessage = err;
      }
    })
  }
  

}
