import { Component, Input, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import { TrafficList } from '../../../../@core/data/traffic-list';

@Component({
  selector: 'ngx-stats-traffic-front-card',
  styleUrls: ['./stats-traffic-front-card.component.scss'],
  templateUrl: './stats-traffic-front-card.component.html',
})
export class StatsTrafficFrontCardComponent implements OnDestroy {

  private alive = true;

  @Input() frontCardData: TrafficList;

  currentTheme: string;

  constructor(private themeService: NbThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
    });
  }

  trackByDate(_, item) {
    return item.date;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
