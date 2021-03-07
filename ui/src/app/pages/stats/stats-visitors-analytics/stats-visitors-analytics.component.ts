import {Component, OnDestroy} from '@angular/core';

@Component({
  selector: 'ngx-stats-visitors-analytics',
  styleUrls: ['./stats-visitors-analytics.component.scss'],
  templateUrl: './stats-visitors-analytics.component.html',
})
export class StatsVisitorsAnalyticsComponent implements OnDestroy {
  private alive = true;

  constructor() {
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
