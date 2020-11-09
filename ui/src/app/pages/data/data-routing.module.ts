import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataComponent } from './data.component';
import { CaseDataComponent } from './case-data/case-data.component';
import { HeatmapComponent } from './heatmap/heatmap.component';

const routes: Routes = [{
  path: '',
  component: DataComponent,
  children: [
    {
      path: 'case-data',
      component: CaseDataComponent,
    },
    {
      path: 'heatmap-data',
      component: HeatmapComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataRoutingModule {
}
