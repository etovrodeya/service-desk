import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';
import { RequestOptions } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { NavbarService } from './navbar.service';

@Injectable()
export class AuthencationService {
  public accessToken: string;
  public refreshToken: string;
  private url = "http://127.0.0.1:3000/api/login/"

  constructor(
    private http: HttpClient,
    private nav: NavbarService
  ) {
    if(localStorage.getItem('currentUser')){
      var currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.accessToken = currentUser.accessToken;
      this.refreshToken = currentUser.refreshToken;
    }
  }
  getCurUser(){
    if(localStorage.getItem('currentUser')){
          return true;
    }
    return false
  }
  login(email: string, password: string) {
    let body = JSON.stringify({email: email, password: password});
    return this.http
        .post(this.url, body,
        {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }).map(data => {
          if(data["accessToken"] && data["refreshToken"]) {
            let accessToken = data["accessToken"];
            let refreshToken = data["refreshToken"];
            let UserName = data["UserName"];
            let userId = data["userId"];
            let status = data["status"];
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            localStorage.setItem('currentUser', JSON.stringify({
              accessToken: accessToken,
              refreshToken: refreshToken,
              UserName: UserName,
              userId: userId,
              status: status
            }));
            return true;
          }
         })
        
    }   
    logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.nav.isAuth = false;
    localStorage.removeItem('currentUser');
    }
}
