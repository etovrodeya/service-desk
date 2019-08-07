import { Injectable, DoCheck, OnInit } from '@angular/core';
import { AuthencationService } from './authencation.service';

@Injectable()
export class NavbarService {
  visible: boolean;
  curStatus: string;
  isAuth: boolean;

  constructor(
  ) {
    this.visible = true;
    this.isAuth = true;
  }
  hide() { this.visible = false; }

  show() { this.visible = true;}

}
