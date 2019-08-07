import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { ActivatedRoute, Params } from '@angular/router';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: `./user-edit.component.html`,
  styles: []
})
export class UserEditComponent implements OnInit {
  id = 1;
  message='';
  model: any = {};
  statuses = [
    {label: "Пользователь"},
    {label: "Администратор"}
  ]

  constructor(
    private activateRoute: ActivatedRoute,
    private usersService: UsersService,
    private nav: NavbarService
  ) {
      this.activateRoute.params.subscribe((params: Params) => {
        this.id = params['id'];
      })
    }

  ngOnInit() {
    this.getUserProfile(this.id.toString());
    this.nav.show();
  }
  getUserProfile(id: string){
    this.usersService.getUserProfile(id.toString()).subscribe(data =>{
      console.log(data)
      this.model.UserName = data['result']['user']["UserName"];
      this.model.userId = data['result']['user']["userId"]
      this.model.phone = data['result']['user']["phone"];
      this.model.office = data['result']['user']["office"]
      this.model.status = data['result']['user']["status"]
      this.model.email = data['result']['user']["email"]
    })
  }
  editUserProfile(){
    this.usersService.editUserProfile(
      this.model.UserName,  
      this.model.phone,  
      this.model.office,  
      this.model.status.label,
      this.model.userId
    ).subscribe(data =>{
      this.message = data['result']['message']
    })
  }
}
