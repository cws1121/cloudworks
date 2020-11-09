import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'ngx-case-data',
  templateUrl: './case-data.component.html',
  styleUrls: ['./case-data.component.scss']
})
export class CaseDataComponent implements OnInit {

  title = 'datatables';
  dtOptions: DataTables.Settings = {};

  constructor() {
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
  }

}
