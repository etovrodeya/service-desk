import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthencationService } from './authencation.service';

@Injectable()
export class UsersService {
  private getUsersListUrl = "http://127.0.0.1:3000/api/users/list"
  private getUserProfileUrl = "http://127.0.0.1:3000/api/users/get"
  private getMyProfileUrl = "http://127.0.0.1:3000/api/users/getMyProfile"
  private createUserUrl = "http://127.0.0.1:3000/api/user/create"
  private editUserProfileUrl = "http://127.0.0.1:3000/api/users/edit"
  private deleteUserUrl = "http://127.0.0.1:3000/api/users/delete"

  constructor(
    private http: HttpClient,
    private authenticationService: AuthencationService ,
  ) { }

  getUsersList(){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    
    return this.http
    .get(this.getUsersListUrl,
    {
      headers: headers,
    })
  }

  getUserProfile(id: string){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    return this.http
    .get(this.getUserProfileUrl,
      {
        headers: headers,
        params: new HttpParams().set('id', id)
      })
  }

  getMyProfile(){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    return this.http
    .get(this.getMyProfileUrl,
      {
        headers: headers
      })
  }
  deleteUser(
    id: string
  ){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    return this.http
    .put(this.deleteUserUrl,
      {
        id:id
      },
      {
        headers: headers
      })
  }

  createUser(
    UserName: string,
    phone: string,
    office: string,
    status: string,
    email: string,
    password: string
  ){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    return this.http
    .post(this.createUserUrl,{
      userName: UserName,
      phone: phone,
      office: office,
      status: status,
      email: email,
      password: password
    })
  }
  editUserProfile(
    UserName: string,
    phone: string,
    office: string,
    status: string,  
    userId: string,  
  ){
    let headers = new HttpHeaders()
    .set('Authorization',this.authenticationService.accessToken)
    .set('refreshToken',this.authenticationService.refreshToken)
    .set('Content-Type','application/json');
    return this.http
    .put(this.editUserProfileUrl,{
      UserName: UserName,
      phone: phone,
      office: office,
      status: status,
      userId: userId
    },{
      headers: headers
    })
  }
}
