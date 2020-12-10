import {Component, OnInit} from '@angular/core';
import {registerMap} from 'echarts';
import {SharedService} from '../../shared.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dashboardStats = {}

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.dashboardStats
      .pipe(filter(results => !!results.data))
      .subscribe(result=>{
      this.dashboardStats = result.data
    })
  }
}
