import { Component, OnInit } from '@angular/core';
import {SharedService} from '../../shared.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'ngx-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}
}
