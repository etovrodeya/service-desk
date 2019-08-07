import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { ActivatedRoute, Params } from '@angular/router';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-user-view',
  templateUrl: `./user-view.component.html`,
  styles: []
})
export class UserViewComponent implements OnInit {
  id=1;
  item='';
  message='';
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
      this.item = data['result']['user']
    })
  }

}
