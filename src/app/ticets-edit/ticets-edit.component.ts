import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TicetsService } from '../services/ticets.service';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-ticets-edit',
  templateUrl: `./ticets-edit.component.html`,
  styles: []
})
export class TicetsEditComponent implements OnInit {
  id = 1;
  message = "";
  model: any = {};
  curatorList = [];
  titleList = [
    {label: 'Ошибка с ПО'},
    {label: 'Закончились расходные материалы'},
    {label: 'Проблема с переферийным оборудыванием'}
  ];
  statusList = [
    {label: 'Внимание'},
    {label: 'В работе'},
    {label: 'Закрыта'}
  ];

  constructor(
    private activateRoute: ActivatedRoute,
    private ticetsService: TicetsService,
    private nav: NavbarService
  ){
      this.activateRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    })}
  ngOnInit() {
    this.getTicet(this.id.toString());
    this.getCuratorList();
    this.nav.show();
  }
  getTicet(id: string){
    this.ticetsService.getTicet(id.toString()).subscribe(data =>{
      this.model.title = data['result']['ticet']["title"];
      this.model.author = data['result']['ticet']["author"];
      this.model.description = data['result']['ticet']["description"]
      this.model.status = data['result']['ticet']["status"]
      this.model.ticetId = data['result']['ticet']["ticetId"]
    })
  }
  getCuratorList(){
    this.ticetsService.getCuratorList().subscribe(data =>{
      this.curatorList = data['result']['usersList']
    })
  }
  editTicet(){
    console.log(this.model)
    this.ticetsService.editTicet(
      this.model.title,  
      this.model.author,  
      this.model.description,  
      this.model.status,  
      this.model.curator.UserName,  
      this.model.curator.userId,  
      this.model.ticetId
    ).subscribe(data =>{
      this.message = data['result']['message']
    })
  }
}
