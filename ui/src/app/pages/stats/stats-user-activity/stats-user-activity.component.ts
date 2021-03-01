import {Component, OnDestroy} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {filter, takeWhile} from 'rxjs/operators';

import {UserActivityData, UserActive} from '../../../@core/data/user-activity';
import {SharedService} from '../../../shared.service';

@Component({
  selector: 'ngx-stats-user-activity',
  styleUrls: ['./stats-user-activity.component.scss'],
  templateUrl: './stats-user-activity.component.html',
})
export class StatsUserActivityComponent implements OnDestroy {

  private alive = true;

  globalStats: any = [];
  userActivity: UserActive[] = [];
  type = 'month';
  types = ['week', 'month', 'year'];
  currentTheme: string;
  positivity_rate = [];
  total_readings = [];

  constructor(private themeService: NbThemeService,
              private userActivityService: UserActivityData, private sharedService: SharedService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    this.sharedService.globalStats
      .pipe(filter(results => !!results.data))
      .subscribe(result => {
        this.globalStats = result.data;
        this.positivity_rate = result.data.positive_readings_per_profile_sum;
        this.total_readings = result.data.total_readings_per_profile_sum;
      });

    this.getUserActivity(this.type);
  }

  getUserActivity(period: string) {
    this.userActivityService.getUserActivityData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(userActivityData => {
        this.userActivity = userActivityData;
      });
  }

  getPositivityPercentage(key){
    return Math.round(this.positivity_rate[key]/this.total_readings[key] * 100)
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
