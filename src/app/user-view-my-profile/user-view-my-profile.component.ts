import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-user-view-my-profile',
  templateUrl: `./user-view-my-profile.component.html`,
  styles: []
})
export class UserViewMyProfileComponent implements OnInit {
  item='';
  message='';
  constructor(
    private activateRoute: ActivatedRoute,
    private usersService: UsersService,
    private nav: NavbarService
  ) { }

  ngOnInit() {
    this.getMyProfile();
    this.nav.show();
  }
  getMyProfile(){
    this.usersService.getMyProfile().subscribe(data=>{
      this.item = data['result']['user']
    })
  }

}
