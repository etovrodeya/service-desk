import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthencationService } from '../services/authencation.service';

@Injectable()
export class IsAdmGuard implements CanActivate {
  curUser: any;
  constructor(
    private authenticationService: AuthencationService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
      if (this.authenticationService.getCurUser()) {
        this.curUser = JSON.parse(localStorage.getItem('currentUser'));
        if (this.curUser.status === 'Администратор'){
          return true
        }
      }
    }
}

