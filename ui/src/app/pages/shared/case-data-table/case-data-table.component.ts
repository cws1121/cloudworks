import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-case-data-table',
  templateUrl: './case-data-table.component.html',
  styleUrls: ['./case-data-table.component.scss']
})
export class CaseDataTableComponent implements OnInit {

  title = 'Test Cases';
  dtOptions: DataTables.Settings = {};

  constructor() { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
  }

}
