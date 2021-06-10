import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Observable} from '../../node_modules/observable-eemi-js/build/index';
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  constructor() {
    const obs = new Observable(12);
    obs.subscribe((val: any) => console.log(val))
  }
}
