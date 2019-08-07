import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TicetsService } from '../services/ticets.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { NavbarService } from '../services/navbar.service';
import { AuthencationService } from '../services/authencation.service';

@Component({
  selector: 'app-ticets-my-supervised-list',
  templateUrl: `./ticets-my-supervised-list.component.html`,
  styles: []
})
export class TicetsMySupervisedListComponent implements OnInit {
  curStatus: string;
  message='';
  @Input() collection: any[] = [];
  
  p: number = 1;

  constructor(
    private http: HttpClient,
    private ticetsService: TicetsService,
    private router: Router,
    private nav: NavbarService,
    private authenticationService: AuthencationService,
  ) {
    this.collection = new Array<any>();
    }

  ngOnInit() {
    this.getMySupervisedList();
    this.nav.show();
  }
  view(id: number) {
    this.router.navigate(['ticets/view/',id]);}
  edit(id: number) {
    this.router.navigate(['ticets/edit/',id]);}
  getMySupervisedList(){
    this.ticetsService.getMySupervisedList().subscribe(data =>{
      if(data['result']['status'] === 'error'){
        this.message=data["result"]["message"];
      } else if(data['result']['status'] === 'OK'){
        this.collection=data["result"]["ticketsList"];
      }
    });
  }
  deleteTicet(
    id: string
  ){
    if(this.curStatus === "Администратор"){
      this.ticetsService.deleteTicet(
        id
      ).subscribe(data =>{
        if(data['result']['status'] === 'OK'){
          this.message = data['result']['message'];
          this.collection = [];
          this.getMySupervisedList();
        }
      })
    } else {
      this.message = 'Вы не можете удалить запись'
    }
  }
}
