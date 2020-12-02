import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NbCardModule,
  NbIconModule,
} from '@nebular/theme';
import {PageHeaderComponent} from './page-header/page-header.component';
import {CaseDataTableComponent} from './case-data-table/case-data-table.component';
import {DataTablesModule} from 'angular-datatables';
import {CaseHeatmapComponent} from './case-heatmap/case-heatmap.component';
import {ChartsModule} from '../charts/charts.module';
import {NgxEchartsModule} from 'ngx-echarts';
import {NgxChartsModule} from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    NbIconModule,
    NbCardModule,
    DataTablesModule,
    ChartsModule,
    NgxEchartsModule,
    NgxChartsModule
  ],
  declarations: [
    PageHeaderComponent,
    CaseDataTableComponent,
    CaseHeatmapComponent
  ],
  exports: [
    PageHeaderComponent,
    CaseDataTableComponent,
    CaseHeatmapComponent
  ]
})
export class SharedModule {
}
