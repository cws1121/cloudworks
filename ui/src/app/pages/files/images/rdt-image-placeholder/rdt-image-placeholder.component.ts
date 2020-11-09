import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'ngx-rdt-image-placeholder',
  templateUrl: 'rdt-image-placeholder.component.html',
  styleUrls: ['rdt-image-placeholder.component.scss'],
})
export class RdtImagePlaceholderComponent {

  @HostBinding('attr.aria-label')
  label = 'Loading';
}
