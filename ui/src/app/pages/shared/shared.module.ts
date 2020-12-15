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
import {FormatDatetimePipe} from './custom-pipes/format-datetime.pipe';
import {FormatResultsJsonPipe} from './custom-pipes/format-results-json.pipe';
import {ResultsExpiryPipe} from './custom-pipes/results-expiry.pipe';

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
    CaseHeatmapComponent,
    FormatDatetimePipe,
    FormatResultsJsonPipe,
    ResultsExpiryPipe
  ],
  exports: [
    PageHeaderComponent,
    CaseDataTableComponent,
    CaseHeatmapComponent,
    FormatDatetimePipe,
    FormatResultsJsonPipe,
    ResultsExpiryPipe
  ]
})
export class SharedModule {
}
