import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbButtonModule,
  NbCardModule,
  NbListModule,
  NbRouteTabsetModule,
  NbStepperModule,
  NbTabsetModule, NbUserModule,
  NbIconModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { FilesRoutingModule } from './files-routing.module';
import { FilesComponent } from './files.component';
import { ImagesComponent } from './images/images.component';
import { RdtImageComponent } from './images/rdt-image/rdt-image.component';
import { RdtImagePlaceholderComponent } from './images/rdt-image-placeholder/rdt-image-placeholder.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbIconModule,
    NbAccordionModule,
    NbUserModule,
    FilesRoutingModule,
    SharedModule
  ],
  declarations: [
    FilesComponent,
    RdtImagePlaceholderComponent,
    ImagesComponent,
    RdtImageComponent,
  ],
  providers: [],
})
export class FilesModule { }
