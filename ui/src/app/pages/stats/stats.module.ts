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
// import { ProfitCardComponent } from './profit-card/profit-card.component';
import { StatsChartsPanelComponent } from './stats-charts-panel/stats-charts-panel.component';
import { StatsOrdersChartComponent } from './stats-charts-panel/stats-charts/stats-orders-chart.component';
import { StatsProfitChartComponent } from './stats-charts-panel/stats-charts/stats-profit-chart.component';
import { StatsChartPanelHeaderComponent } from './stats-charts-panel/stats-chart-panel-header/stats-chart-panel-header.component';
import { StatsChartPanelSummaryComponent } from './stats-charts-panel/stats-chart-panel-summary/stats-chart-panel-summary.component';
import { ChartModule } from 'angular2-chartjs';
// import { StatsCardBackComponent } from './profit-card/back-side/stats-card-back.component';
// import { StatsAreaChartComponent } from './profit-card/back-side/stats-area-chart.component';
// import { StatsBarAnimationChartComponent } from './profit-card/front-side/stats-bar-animation-chart.component';
// import { StatsCardFrontComponent } from './profit-card/front-side/stats-card-front.component';
import { StatsTrafficRevealCardComponent } from './stats-traffic-reveal-card/stats-traffic-reveal-card.component';
import { StatsTrafficBarComponent } from './stats-traffic-reveal-card/front-side/stats-traffic-bar/stats-traffic-bar.component';
import { StatsTrafficFrontCardComponent } from './stats-traffic-reveal-card/front-side/stats-traffic-front-card.component';
import { StatsTrafficCardsHeaderComponent } from './stats-traffic-reveal-card/traffic-cards-header/stats-traffic-cards-header.component';
import { StatsTrafficBackCardComponent } from './stats-traffic-reveal-card/back-side/stats-traffic-back-card.component';
import { StatsTrafficBarChartComponent } from './stats-traffic-reveal-card/back-side/stats-traffic-bar-chart.component';
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
// import { EarningCardComponent } from './earning-card/earning-card.component';
// import { EarningCardBackComponent } from './earning-card/back-side/earning-card-back.component';
// import { EarningPieChartComponent } from './earning-card/back-side/earning-pie-chart.component';
// import { EarningCardFrontComponent } from './earning-card/front-side/earning-card-front.component';
// import { EarningLiveUpdateChartComponent } from './earning-card/front-side/earning-live-update-chart.component';

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
    // StatsCardFrontComponent,
    // StatsAreaChartComponent,
    // StatsBarAnimationChartComponent,
    // ProfitCardComponent,
    StatsChartsPanelComponent,
    StatsChartPanelHeaderComponent,
    StatsChartPanelSummaryComponent,
    StatsOrdersChartComponent,
    StatsProfitChartComponent,
    // StatsCardBackComponent,
    StatsTrafficRevealCardComponent,
    StatsTrafficBarChartComponent,
    StatsTrafficFrontCardComponent,
    StatsTrafficBackCardComponent,
    StatsTrafficBarComponent,
    StatsTrafficCardsHeaderComponent,
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
    // EarningCardComponent,
    // EarningCardFrontComponent,
    // EarningCardBackComponent,
    // EarningPieChartComponent,
    // EarningLiveUpdateChartComponent,
  ],
  providers: [
    CountryOrdersMapService,
  ],
  exports:[]
})
export class ECommerceModule { }
