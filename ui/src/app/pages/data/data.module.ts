import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseDataComponent } from './case-data/case-data.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
import {DataRoutingModule} from './data-routing.module';
import {DataComponent} from './data.component';
import {NbCardModule, NbIconModule} from '@nebular/theme';
import {SharedModule} from '../shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {ChartsModule} from '../charts/charts.module';
import {NgxEchartsModule} from 'ngx-echarts';
import {NgxChartsModule} from '@swimlane/ngx-charts';

@NgModule({
  declarations: [CaseDataComponent, HeatmapComponent, DataComponent],
  imports: [
    CommonModule,
    DataRoutingModule,
    NbCardModule,
    SharedModule,
    DataTablesModule,
    NgxEchartsModule,
    NgxChartsModule,
    NbIconModule,
    ChartsModule
  ]
})
export class DataModule { }
