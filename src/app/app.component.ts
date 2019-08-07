import { Component, ChangeDetectorRef, DoCheck, AfterContentChecked } from '@angular/core';
import { NavbarService } from './services/navbar.service';
import { AuthencationService } from './services/authencation.service';

@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  styles: []
})
export class AppComponent implements DoCheck, AfterContentChecked {

  constructor(
    private authenticationService: AuthencationService,
    private nav: NavbarService,
    private cdRef:ChangeDetectorRef
) { }
ngDoCheck(){
  if(this.authenticationService.getCurUser()){
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.nav.curStatus = currentUser.status;
    this.nav.show();
    this.nav.isAuth=true;
  } else {
    this.nav.isAuth=false;
  }
}
ngAfterContentChecked(){
  this.cdRef.detectChanges();
}
}
