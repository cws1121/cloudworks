import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCardModule,
  NbIconModule,
} from '@nebular/theme';
import {PageHeaderComponent} from './page-header/page-header.component';

@NgModule({
  imports: [
    CommonModule,
    NbIconModule,
    NbCardModule
  ],
  declarations:[
    PageHeaderComponent
  ],
  exports:[
    PageHeaderComponent
  ]
})
export class SharedModule { }
