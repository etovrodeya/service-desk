import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthencationService } from './authencation.service';
import { Observable } from 'rxjs/Observable';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class TicetsService {
  private getTicetListUrl = "http://127.0.0.1:3000/api/ticets/list"
  private getMyTicetListUrl = "http://127.0.0.1:3000/api/ticets/myList"
  private getMySupervisedListUrl = "http://127.0.0.1:3000/api/ticets/mySupervisedList"
  private getTicetUrl = "http://127.0.0.1:3000/api/ticets/get"
  private getCuratorListUrl = "http://127.0.0.1:3000/api/users/getAdminsList"
  private createTicetUrl = "http://127.0.0.1:3000/api/ticets/create"
  private editTicetUrl = "http://127.0.0.1:3000/api/ticets/edit"
  private getCommentListUrl = "http://127.0.0.1:3000/api/comment/getList"
  private createCommentUrl = "http://127.0.0.1:3000/api/comment/create"
  private deleteCommentUrl = "http://127.0.0.1:3000/api/comment/delete"
  private deleteTicetUrl = "http://127.0.0.1:3000/api/ticets/delete"

  constructor(
    private http: HttpClient,
    private authenticationService: AuthencationService ,
  ) { }
  
  getCommentList(
    id:string
  ){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    
    return this.http
    .get(this.getCommentListUrl,
    {
      headers: headers,
      params: new HttpParams().set('id', id)
    })
  }
  createComment(
    ticetId: number,
    UserName: string,
    userId: number,
    text: string
  ){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    return this.http
    .post(this.createCommentUrl,{
      ticetId: ticetId,
      UserName: UserName,
      userId: userId,
      text: text
    },{
      headers: headers
    })
  }
  deleteComment(
    id: string
  ){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    return this.http
    .put(this.deleteCommentUrl,
      {
        id:id
      },
      {
        headers: headers
      })
  }
  deleteTicet(
    id: string
  ){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    return this.http
    .put(this.deleteTicetUrl,
      {
        id:id
      },
      {
        headers: headers
      })
  }

  getTicetsList(){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    
    return this.http
    .get(this.getTicetListUrl,
    {
      headers: headers,
    })
  }
  getMyTicetsList(){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    
    return this.http
    .get(this.getMyTicetListUrl,
    {
      headers: headers,
    })
  }
  
  getCuratorList(){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    
    return this.http
    .get(this.getCuratorListUrl,
    {
      headers: headers,
    })
  }
  
  getMySupervisedList(){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    
    return this.http
    .get(this.getMySupervisedListUrl,
    {
      headers: headers,
    })
  }
  getTicet(id: string){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    return this.http
    .get(this.getTicetUrl,
      {
        headers: headers,
        params: new HttpParams().set('id', id)
      })
  }
  createTicet(
    description: string  
  ){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    return this.http
    .post(this.createTicetUrl,{
      description: description
    },{
      headers: headers
    })
  }
  editTicet(
    title: string,
    author: string,
    description: string,
    status: string,
    curator: string,
    curatorId: number,
    ticetId: number    
  ){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    return this.http
    .put(this.editTicetUrl,{
      title: title,
      author: author,
      description: description,
      status: status,
      curator: curator,
      curatorId: curatorId,
      ticetId: ticetId,
    },{
      headers: headers
    })
  }
}
