import {NgModule} from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbProgressBarModule,
  NbTabsetModule,
  NbUserModule,
  NbIconModule,
  NbSelectModule,
  NbListModule,
} from '@nebular/theme';
import {NgxEchartsModule} from 'ngx-echarts';
import {NgxChartsModule} from '@swimlane/ngx-charts';

import {ThemeModule} from '../../@theme/theme.module';
import {HomeComponent} from './home.component';
import {SharedModule} from '../shared/shared.module';
import {ECommerceModule} from '../e-commerce/e-commerce.module';
import {ChartsModule} from '../charts/charts.module';
import { DataTablesModule } from 'angular-datatables';
import { StatusBoxComponent } from './status-box/status-box.component';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbTabsetModule,
    NbSelectModule,
    NbListModule,
    NbProgressBarModule,
    NgxEchartsModule,
    NgxChartsModule,
    SharedModule,
    ECommerceModule,
    ChartsModule,
    DataTablesModule
  ],
  declarations: [
    HomeComponent,
    StatusBoxComponent
  ],
  providers: [],
})
export class HomeModule {
}
