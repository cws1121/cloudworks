import {Component, OnInit} from '@angular/core';
import {registerMap} from 'echarts';
import {SharedService} from '../../shared.service';
import {filter, takeWhile} from 'rxjs/operators';
import {ProfitBarAnimationChartService} from '../../@core/mock/profit-bar-animation-chart.service';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dashboardStats = {
    total_readings: 'N/A',
    positive_readings: 'N/A',
    agreement: 'N/A',
    positivity_rate: 'N/A'
  };
  linesData: { firstLine: number[]; secondLine: number[] };

  totalReadingsLinesData: { firstLine: number[]; secondLine: number[]};

  private alive = true;

  constructor(private profitBarAnimationChartService: ProfitBarAnimationChartService, private sharedService: SharedService) {
    this.totalReadingsLinesData = {firstLine:[], secondLine:[]}
  }

  ngOnInit(): void {
    this.sharedService.dashboardStats
      .pipe(filter(results => !!results.data))
      .subscribe(result => {
        this.dashboardStats = result.data;
        this.totalReadingsLinesData.firstLine = result.data.readings_chart_data.total_readings
      });

    this.profitBarAnimationChartService.getChartData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((linesData) => {
        this.linesData = linesData;
      });
  }
}
