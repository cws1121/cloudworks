import { Component, OnInit } from '@angular/core';
import {SharedService} from '../../shared.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'ngx-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  globalStats = {
    total_readings: 'N/A',
    positive_readings: 'N/A',
    agreement: 'N/A',
    positivity_rate: 'N/A',
    total_readings_per_profile_sum: 'N/A',
    positive_readings_per_profile_sum: 'N/A'
  };

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.globalStats
      .pipe(filter(results => !!results.data))
      .subscribe(result => {
        this.globalStats = result.data;
      });
  }
}
