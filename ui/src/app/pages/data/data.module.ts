import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseDataComponent } from './case-data/case-data.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
import {DataRoutingModule} from './data-routing.module';
import {DataComponent} from './data.component';
import {NbCardModule, NbIconModule} from '@nebular/theme';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [CaseDataComponent, HeatmapComponent, DataComponent],
  imports: [
    CommonModule,
    DataRoutingModule,
    NbCardModule,
    SharedModule,
    NbIconModule
  ],
  exports: []
})
export class DataModule { }
