import { Component } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { NavbarService } from '../services/navbar.service';
import { AuthencationService } from '../services/authencation.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: `./side-navbar.component.html`,
  styles: []
})
export class SideNavbarComponent {

  constructor(
    private url:LocationStrategy,
    public nav: NavbarService
  ) { }
}
