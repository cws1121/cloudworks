import { NgModule } from '@angular/core';
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
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../@theme/theme.module';
import { StatsComponent } from './stats.component';
import { ChartModule } from 'angular2-chartjs';
import {
  StatsVisitorsAnalyticsComponent,
} from './stats-visitors-analytics/stats-visitors-analytics.component';
import {
  StatsVisitorsAnalyticsChartComponent,
} from './stats-visitors-analytics/stats-visitors-analytics-chart/stats-visitors-analytics-chart.component';
import {
  StatsVisitorsStatisticsComponent,
} from './stats-visitors-analytics/stats-visitors-statistics/stats-visitors-statistics.component';
import { StatsLegendChartComponent } from './stats-legend-chart/stats-legend-chart.component';
import { StatsUserActivityComponent } from './stats-user-activity/stats-user-activity.component';
import { StatsProgressSectionComponent } from './stats-progress-section/stats-progress-section.component';
import { StatsSlideOutComponent } from './stats-slide-out/stats-slide-out.component';

import { StatsCountryOrdersComponent } from './stats-country-orders/stats-country-orders.component';
import { StatsCountryOrdersMapComponent } from './stats-country-orders/stats-map/stats-country-orders-map.component';
import { CountryOrdersMapService } from '../e-commerce/country-orders/map/country-orders-map.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { StatsCountryOrdersChartComponent } from './stats-country-orders/stats-chart/stats-country-orders-chart.component';

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
    ChartModule,
    NbProgressBarModule,
    NgxEchartsModule,
    NgxChartsModule,
    LeafletModule,
  ],
  declarations: [
    StatsComponent,
    StatsCountryOrdersComponent,
    StatsCountryOrdersMapComponent,
    StatsCountryOrdersChartComponent,
    StatsVisitorsAnalyticsComponent,
    StatsVisitorsAnalyticsChartComponent,
    StatsVisitorsStatisticsComponent,
    StatsLegendChartComponent,
    StatsUserActivityComponent,
    StatsProgressSectionComponent,
    StatsSlideOutComponent,
  ],
  providers: [
    CountryOrdersMapService,
  ],
  exports:[]
})
export class StatsModule { }
