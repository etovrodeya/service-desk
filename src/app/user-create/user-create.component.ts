import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { NavbarService } from '../services/navbar.service';
import { NgForm} from '@angular/forms';

@Component({
  selector: 'app-user-create',
  templateUrl: `./user-create.component.html`,
  styles: []
})
export class UserCreateComponent implements OnInit {
  message:string;
  model:any={};
  statuses = [
    {label: "Пользователь"},
    {label: "Администратор"}
  ]

  constructor(
    private usersService: UsersService,
    private nav: NavbarService
  ) { }

  ngOnInit() {
    this.nav.show();
  }
  createUser(){
    this.usersService.createUser(
      this.model.userName,
      this.model.phone,
      this.model.office,
      this.model.status.label,
      this.model.email,
      this.model.password
    ).subscribe(data =>{
      console.log(data)
      if(data['result']['status'] === 'error'){
        this.message = data['result']['message']['errmsg'];
      }
      if(data['result']['status'] === 'OK'){
        this.message = data['result']['message'];
      }
    })
  }

}
