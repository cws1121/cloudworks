import { Component, OnInit, Input } from '@angular/core';
import {NbIconLibraries} from '@nebular/theme';

@Component({
  selector: 'ngx-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() icon: string;
  @Input() pack: string;

  constructor(iconsLibrary: NbIconLibraries) {
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('fas', { packClass: 'fas', iconClassPrefix: 'fa' });
  }

  ngOnInit(): void {
  }

}
