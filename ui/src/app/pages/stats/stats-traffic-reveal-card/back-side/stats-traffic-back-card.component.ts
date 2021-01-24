import { Component, Input, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-stats-traffic-back-card',
  styleUrls: ['./stats-traffic-back-card.component.scss'],
  templateUrl: './stats-traffic-back-card.component.html',
})
export class StatsTrafficBackCardComponent implements OnDestroy {

  private alive = true;

  @Input() trafficBarData: any;

  currentTheme: string;

  constructor(private themeService: NbThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
