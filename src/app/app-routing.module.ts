import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { CustomersComponent } from './customers/customers.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { NewProductComponent } from './new-product/new-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';

const routes: Routes = [
  {path : "", component : LoginComponent},
  {path : "login", component : LoginComponent},
  {path : "dashboard", component : DashboardComponent, canActivate : [AuthenticationGuard],
  children : [
    /* hna products w customers wlaw des children dial dashboard ay khass dir /dashboard/products 3ad dkhol lihom */
    {path : "products", component : ProductsComponent},
    {path : "customers", component : CustomersComponent},
    {path : "admin/new-product", component : NewProductComponent},
    {path : "admin/edit-product/:id", component : EditProductComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
