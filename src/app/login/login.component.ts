import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // hna had userForm howa li ghadi ytstokaw fih les données dial form ay ghaykon Data Binding bin form et userForm
  userForm! : FormGroup;  
  errorMessage :string = "";

  constructor(private authService : AuthenticationService, 
              private formBuilder : FormBuilder,
              private router : Router) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({

      username : this.formBuilder.control(""),
      password : this.formBuilder.control("")

    })
  }

  handleLogin() {

    let username = this.userForm.value.username;
    let password = this.userForm.value.password;

    this.authService.login(username,password).subscribe({
      next: (user) => {
        /* hna ila kan kolchi s7i7 ghayrja3 lina un objet de type User aprés ghadi n3ayto 3la authenticateUser() 
        bach yt enregistra f localstorage aprés ghadi nseftoh l la page products */
        this.authService.authenticateUser(user).subscribe({
          next : () => {
            this.router.navigateByUrl("/dashboard");
          }
        })
      },
      error : (err) => {
        this.errorMessage = err;
      }
    })
  }

}
