import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TicetsService } from '../services/ticets.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthencationService } from '../services/authencation.service';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-ticet-view',
  templateUrl: `./ticet-view.component.html`,
  styles: []
})
export class TicetViewComponent implements OnInit {
  id = 1;
  item: any;
  message = "";
  @Input() commentList: any[] = [];
  commentModel: any ={};
  curUserName: string;
  curUserId: number;
  curStatus: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private ticetsService: TicetsService,
    private authenticationService: AuthencationService,
    private nav: NavbarService
  ){
    this.activateRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.commentList = new Array<any>();
  }
  ngOnInit() {
    this.getTicet(this.id.toString());
    this.getCommentList(this.id.toString());
    this.nav.show();
    if(this.authenticationService.getCurUser()){
      var currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.curUserName = currentUser.UserName;
      this.curUserId = currentUser.userId;
      this.curStatus = currentUser.status;
    }
  }
  getTicet(
    id: string
  ){
    this.ticetsService.getTicet(id.toString()).subscribe(data =>{
      this.item = data['result']['ticet']
    })
  }
  getCommentList(
    id: string
  ){
    this.ticetsService.getCommentList(id).subscribe(data=>{
      if(data['result']['status'] === 'error'){
        this.message=data["result"]["message"];
      } else if(data['result']['status'] === 'OK'){
        this.commentList=data["result"]["commentList"];
      }
    })
  }
  createComment(){
    if(this.item.userId === this.curUserId || this.curStatus === "Администратор"){
      this.ticetsService.createComment(
        this.item.ticetId,
        this.curUserName,
        this.curUserId,
        this.commentModel.text
      ).subscribe(data =>{
        if(data['result']['status'] === 'OK'){
          this.message = data['result']['message'];
          this.commentList = [];
          this.getCommentList(this.id.toString());
          this.commentModel.text = null;
        }
      })
      console.log(this.item)
      console.log(this.commentModel)
    } else {
      this.message = 'Вы не можете оставлять коментарии'
    }
  }
  deleteComment(
    id: string
  ){
    if(this.item.userId === this.curUserId || this.curStatus === "Администратор"){
      this.ticetsService.deleteComment(
        id
      ).subscribe(data =>{
        if(data['result']['status'] === 'OK'){
          this.message = data['result']['message'];
          this.commentList = [];
          this.getCommentList(this.id.toString());
        }
      })
    } else {
      this.message = 'Вы не можете удалять коментарии'
    }
  }
  deleteTicet(
    id: string
  ){
    if(this.item.userId === this.curUserId || this.curStatus === "Администратор"){
      this.ticetsService.deleteTicet(
        id
      ).subscribe(data =>{
        if(data['result']['status'] === 'OK'){
          this.message = data['result']['message'];
        }
      })
    } else {
      this.message = 'Вы не можете удалить запись'
    }
  }
}
