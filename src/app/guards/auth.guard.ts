import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthencationService } from '../services/authencation.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authenticationService: AuthencationService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
      if (this.authenticationService.getCurUser()) {
        return true;
    }
  }
}
