import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { AuthencationService } from '../services/authencation.service';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-user-list',
  templateUrl: `./user-list.component.html`,
  styles: []
})
export class UserListComponent implements OnInit {
  message='';
  @Input() collection: any[] = [];
  p: number = 1;
  curStatus: string;

  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private authenticationService: AuthencationService,
    private router: Router,
    private nav: NavbarService
  ) {
      this.collection = new Array<any>();
    }

  ngOnInit() {
    this.getUsersList();
    this.nav.show();
    if(this.authenticationService.getCurUser()){
      var currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.curStatus = currentUser.status;
    }
  }
  view(id: number) {
    this.router.navigate(['users/view/',id]);}
  edit(id: number) {
    this.router.navigate(['users/edit/',id]);}
  getUsersList(){
    this.usersService.getUsersList().subscribe(data =>{
      if(data['result']['status'] === 'error'){
        this.message=data["result"]["message"];
      } else if(data['result']['status'] === 'OK'){
        this.collection=data["result"]["usersList"];
      }
    })};
  deleteUser(
      id: string
     ){
      if(this.curStatus === "Администратор"){
        this.usersService.deleteUser(
          id
        ).subscribe(data =>{
          if(data['result']['status'] === 'OK'){
            this.message = data['result']['message'];
            this.collection = [];
            this.getUsersList();
          }
        })
      } else {
        this.message = 'Вы не можете удалить запись'
      }
    }
}
