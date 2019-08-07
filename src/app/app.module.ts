import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AuthGuard } from './guards/auth.guard';
import { IsAdmGuard } from './guards/is-adm.guard';

import { TicetsService } from './services/ticets.service';
import { UsersService } from './services/users.service';
import { NavbarService } from './services/navbar.service';
import { AuthencationService } from './services/authencation.service';

import {NgxPaginationModule} from 'ngx-pagination';

import { TicetsListComponent } from './ticets-list/ticets-list.component';
import { TicetViewComponent } from './ticet-view/ticet-view.component';
import { TicetsEditComponent } from './ticets-edit/ticets-edit.component';
import { TicetCreateComponent } from './ticet-create/ticet-create.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserViewComponent } from './user-view/user-view.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserViewMyProfileComponent } from './user-view-my-profile/user-view-my-profile.component';
import { TicetsMyListComponent } from './ticets-my-list/ticets-my-list.component';
import { TicetsMySupervisedListComponent } from './ticets-my-supervised-list/ticets-my-supervised-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', redirectTo: 'login', canActivate: [AuthGuard] },
  { path: 'registration', component: UserCreateComponent },
  { path: 'ticets/page', component: TicetsListComponent, canActivate: [IsAdmGuard] },
  { path: 'ticets/myList', component: TicetsMyListComponent, canActivate: [AuthGuard] },
  { path: 'ticets/supervisedList', component: TicetsMySupervisedListComponent, canActivate: [IsAdmGuard] },
  { path: 'ticets/create', component: TicetCreateComponent, canActivate: [AuthGuard] },
  { path: 'ticets/view/:id', component: TicetViewComponent, canActivate: [AuthGuard] },
  { path: 'ticets/edit/:id', component: TicetsEditComponent, canActivate: [IsAdmGuard] },
  { path: 'users/page', component: UserListComponent, canActivate: [IsAdmGuard] },
  { path: 'users/view/profile', pathMatch: 'full', component: UserViewMyProfileComponent, canActivate: [AuthGuard] },
  { path: 'users/view/:id', component: UserViewComponent, canActivate: [IsAdmGuard] },
  { path: 'users/edit/:id', component: UserEditComponent, canActivate: [IsAdmGuard] },

//  { path:'', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TicetsListComponent,
    TicetViewComponent,
    TicetsEditComponent,
    TicetCreateComponent,
    UserCreateComponent,
    UserListComponent,
    UserViewComponent,
    UserEditComponent,
    UserViewMyProfileComponent,
    TicetsMyListComponent,
    TicetsMySupervisedListComponent,
    NavbarComponent,
    SideNavbarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    NgxPaginationModule
  ],
  providers: [
    AuthencationService,
    AuthGuard,
    IsAdmGuard,
    TicetsService,
    UsersService,
    NavbarService
  ],
  bootstrap: [
    AppComponent,
    LoginComponent,
  ]
})
export class AppModule { }
