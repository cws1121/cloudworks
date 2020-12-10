import {Component, OnDestroy} from '@angular/core';
import {NbThemeService, NbColorHelper} from '@nebular/theme';
import {SharedService} from '../../../shared.service';
import {combineLatest} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'ngx-bar-chart-readings',
  template: `
    <chart type="bar" [data]="data" [options]="options"></chart>
  `,
})
export class BarChartReadingsComponent implements OnDestroy {
  data: any;
  options: any;
  subscription: any;

  constructor(private theme: NbThemeService, private sharedService: SharedService) {
    let dashboardStatsPromise = this.sharedService.dashboardStats;
    let jsThemePromise = this.theme.getJsTheme();

    this.subscription = combineLatest([dashboardStatsPromise, jsThemePromise])
      .pipe(filter(results => !!results[0].data)).subscribe(results => {

        const chart_data: any = results[0].data.readings_chart_data;
        const colors: any = results[1].variables;
        const chartjs: any = results[1].variables.chartjs;

        this.data = {
          labels: chart_data.days,
          datasets: [{
            data: chart_data.total_readings,
            label: 'Total Readings',
            backgroundColor: NbColorHelper.hexToRgbA(colors.primaryLight, 0.8),
          }, {
            data: chart_data.disagreed_readings,
            label: 'Disagreed Readings',
            backgroundColor: NbColorHelper.hexToRgbA(colors.infoLight, 0.8),
          }],
        };

        this.options = {
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            labels: {
              fontColor: chartjs.textColor,
            },
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false,
                  color: chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: chartjs.textColor,
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  display: true,
                  color: chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: chartjs.textColor,
                },
              },
            ],
          },
        };
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
