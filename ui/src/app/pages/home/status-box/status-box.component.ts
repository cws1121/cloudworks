import {Component, OnInit, Input} from '@angular/core';
import {ProfitBarAnimationChartData} from '../../../@core/data/profit-bar-animation-chart';
import {takeWhile} from 'rxjs/operators';
import {NbIconLibraries} from '@nebular/theme';

@Component({
  selector: 'ngx-status-box',
  templateUrl: './status-box.component.html',
  styleUrls: ['./status-box.component.scss']
})
export class StatusBoxComponent implements OnInit {

  private alive = true;

  @Input() title: string;
  @Input() value: string;
  @Input() icon: string;
  @Input() pack: string;

  linesData: { firstLine: number[]; secondLine: number[] };

  constructor(private profitBarAnimationChartService: ProfitBarAnimationChartData, iconsLibrary: NbIconLibraries) {
    iconsLibrary.registerFontPack('fa', {packClass: 'fa', iconClassPrefix: 'fa'});
    iconsLibrary.registerFontPack('far', {packClass: 'far', iconClassPrefix: 'fa'});
    iconsLibrary.registerFontPack('fas', {packClass: 'fas', iconClassPrefix: 'fa'});

    this.profitBarAnimationChartService.getChartData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((linesData) => {
        this.linesData = linesData;
      });
  }

  ngOnInit(): void {
  }

}
