import { Component, OnInit } from '@angular/core';
import { TicetsService } from '../services/ticets.service';
import { ActivatedRoute } from '@angular/router';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-ticet-create',
  templateUrl: `./ticet-create.component.html`,
  styles: []
})
export class TicetCreateComponent implements OnInit {
  message: string;
  model: any = {};
  constructor(
    private activateRoute: ActivatedRoute,
    private ticetsService: TicetsService,
    private nav: NavbarService
  ) { }

  ngOnInit() {
    this.nav.show();
  }
  createTicet(){
    this.ticetsService.createTicet(
      this.model.description
    ).subscribe(data =>{
      this.message = data['result']['message']
    })
  }

}
