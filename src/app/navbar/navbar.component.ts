import { Component } from '@angular/core';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: `./navbar.component.html`,
  styles: []
})
export class NavbarComponent {
  title = 'Техническая поддержка'
  constructor(
    public nav: NavbarService
  ) { }

}
