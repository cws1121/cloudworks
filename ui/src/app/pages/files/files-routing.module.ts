import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilesComponent } from './files.component';
import { ImagesComponent } from './images/images.component';

const routes: Routes = [{
  path: '',
  component: FilesComponent,
  children: [
    {
      path: 'images',
      component: ImagesComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilesRoutingModule {
}
