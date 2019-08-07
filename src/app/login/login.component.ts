import { Component, OnInit } from '@angular/core';
import { AuthencationService } from '../services/authencation.service';
import { Router } from '@angular/router';
import { NgForm} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-login',
  templateUrl: `./login.component.html`,
  styles: []
})
export class LoginComponent implements OnInit {
  error = '';
  model: any = {};

  constructor(
      private router: Router,
      private authenticationService: AuthencationService,
      public nav: NavbarService) { }

  ngOnInit() {
      // reset login status
      this.authenticationService.logout();
      this.nav.show();
      this.nav.isAuth=false;
      this.nav.curStatus=null;
  }

  login() {
      this.authenticationService.login(this.model.email, this.model.password)
          .subscribe(result => {
            this.error = null;
            this.router.navigate(['users/view/profile/']);
            this.nav.show();
            this.nav.isAuth=true;
          },(err: HttpErrorResponse) => {
            this.error = 'Неправильные адрес электронной почты или пароль';
          })
  };
  registrarion(){
    this.router.navigate(['registration/']);
  }
}

