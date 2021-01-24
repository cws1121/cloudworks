import { Component, OnDestroy } from '@angular/core';
import { ProgressInfo, StatsProgressBarData } from '../../../@core/data/stats-progress-bar';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-stats-progress-section',
  styleUrls: ['./stats-progress-section.component.scss'],
  templateUrl: './stats-progress-section.component.html',
})
export class StatsProgressSectionComponent implements OnDestroy {

  private alive = true;

  progressInfoData: ProgressInfo[];

  constructor(private statsProgressBarService: StatsProgressBarData) {
    this.statsProgressBarService.getProgressInfoData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.progressInfoData = data;
      });
  }

  ngOnDestroy() {
    this.alive = true;
  }
}
