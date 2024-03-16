import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../model/product.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  
  editProductForm! : FormGroup;
  productId! : string;
  product! : Product;
  errorMessage : string = "";

  constructor(private route : ActivatedRoute ,private fb: FormBuilder,public productService: ProductService) { 
    this.productId = this.route.snapshot.params['id']; // hadi bach nrécupriw id mn url

  }

  ngOnInit(): void {
    this.productService.getProduct(this.productId).subscribe({
      next : (data) => {

        this.product = data

        this.editProductForm = this.fb.group({
          name : this.fb.control(this.product.name, [Validators.required, Validators.minLength(4)]),
          price : this.fb.control(this.product.price, [Validators.required, Validators.min(100)]),
          promotion : this.fb.control(this.product.promotion)
        })
    
      },
      error : (err) => {
        this.errorMessage = err;
      }
    })
  }
  
  handleUpdateProduct() {
    let p = this.editProductForm.value;
    p.id = this.product.id;

    this.productService.updateProduct(p).subscribe({
      next : () => {
        alert("Product Updated Successfully");
      },
      error : (err) => {
        this.errorMessage = err;
      }
    })
  }
  
}
