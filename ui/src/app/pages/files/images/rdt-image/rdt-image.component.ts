import { Component, Input } from '@angular/core';

class ImagePost {
  file: string;
  uploaded_at: string;
  external_id: string;
}

@Component({
  selector: 'ngx-rdt-image',
  templateUrl: 'rdt-image.component.html',
  styleUrls: ['rdt-image.component.scss'],
})
export class RdtImageComponent {

  @Input() post: ImagePost;
}
