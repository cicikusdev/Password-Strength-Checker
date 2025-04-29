import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PasswordCheckerComponent} from './password-checker/password-checker.component';

const routes: Routes = [{path:'', component: PasswordCheckerComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
