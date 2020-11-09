import { Component, Input } from '@angular/core';

import { ImagePost } from '../../images.service';

@Component({
  selector: 'ngx-rdt-image',
  templateUrl: 'rdt-image.component.html',
  styleUrls: ['rdt-image.component.scss'],
})
export class RdtImageComponent {

  @Input() post: ImagePost;
}
