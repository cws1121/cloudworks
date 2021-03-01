import {Component, OnDestroy} from '@angular/core';
import {filter, takeWhile} from 'rxjs/operators';
import {NbThemeService} from '@nebular/theme';
import {OutlineData, VisitorsAnalyticsData} from '../../../@core/data/visitors-analytics';
import {combineLatest, forkJoin} from 'rxjs';
import {SharedService} from '../../../shared.service';


@Component({
  selector: 'ngx-stats-visitors-analytics',
  styleUrls: ['./stats-visitors-analytics.component.scss'],
  templateUrl: './stats-visitors-analytics.component.html',
})
export class StatsVisitorsAnalyticsComponent implements OnDestroy {
  private alive = true;

  globalStats = {
    total_readings: 1,
    positive_readings: 1,
    agreement: 'N/A',
    positivity_rate: 22,
    readings_chart_data:[],
    positivity_rate_by_domain:[]
  };

  subscription: any;
  chartLegend: { iconColor: string; title: string }[] = [];

  constructor(private themeService: NbThemeService,
              private visitorsAnalyticsChartService: VisitorsAnalyticsData,
              private sharedService: SharedService) {

    let globalStatsPromise = this.sharedService.globalStats;
    let jsThemePromise = this.themeService.getJsTheme();

    this.subscription = combineLatest([globalStatsPromise, jsThemePromise])
      .pipe(filter(results => !!results[0].data))
      .pipe(takeWhile(() => this.alive))
      .subscribe(results => {
        this.globalStats = results[0].data;
        this.setLegendItems(results[0].data.test_profiles);
        this.globalStats.positivity_rate = Math.round(this.globalStats.positive_readings / this.globalStats.total_readings * 100);
      });
  }

  setLegendItems(testProfiles): void {
   this.chartLegend = []
    for (var i = 0; i < testProfiles.length; i++) {
      this.chartLegend.push({
        iconColor: this.intToHEX(this.hashCode(testProfiles[i])),
        title: testProfiles[i],
      });
    }
  }

  hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  intToHEX(i) {
    var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return '#'+'00000'.substring(0, 6 - c.length) + c;
  }

  ngOnDestroy() {
    this.alive = false;
    this.subscription.unsubscribe();
  }
}
