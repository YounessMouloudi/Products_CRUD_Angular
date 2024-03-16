import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public authService : AuthenticationService , private router: Router) { }

  ngOnInit(): void {
    // this.authService.
  }

  handleLogout() {
    this.authService.logout().subscribe({
      next : () => {
        this.router.navigateByUrl("/login");
      },
      error : () => {

      }
    })
  }

}
