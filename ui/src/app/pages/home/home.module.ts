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

import {ThemeModule} from '../../@theme/theme.module';
import {HomeComponent} from './home.component';
import {SharedModule} from '../shared/shared.module';
import {ECommerceModule} from '../e-commerce/e-commerce.module';
import {StatusBoxComponent} from './status-box/status-box.component';
import {BarChartReadingsComponent} from './bar-chart-readings/bar-chart-readings.component';
import {ChartModule} from 'angular2-chartjs';
import {XaxisChartValidityComponent} from './xaxis-chart-validity/xaxis-chart-validity.component';

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
    SharedModule,
    ECommerceModule,
    ChartModule,
  ],
  declarations: [
    HomeComponent,
    StatusBoxComponent,
    BarChartReadingsComponent,
    XaxisChartValidityComponent
  ],
  providers: [],
})
export class HomeModule {
}
