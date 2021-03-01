import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SharedService} from '../../../shared.service';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {DataTableDirective} from 'angular-datatables';

@Component({
  selector: 'ngx-case-data-table',
  templateUrl: './case-data-table.component.html',
  styleUrls: ['./case-data-table.component.scss']
})
export class CaseDataTableComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  testResultList = [];

  constructor(private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order:[[6, 'desc']]
    };

    this.sharedService.testResultList
      .pipe(filter(result => !!result.data))
      .subscribe(result => {
        this.testResultList = result['data']['test_results'];
        this.rerender();
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger.next();
    },);
  }

  rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
  }

  getInstructionsViewedAttr(metrics){
    if (!metrics) return 'N/A';
    var metrics_json = JSON.parse(metrics.replaceAll("'", "\""))
    return (metrics_json && metrics_json['data'] && metrics_json['data']['instructions_viewed']) || 'N/A'
  }

  getClassifierModeAttr(raw_payload){
    if (!raw_payload) return 'N/A';
    var raw_payload_json = JSON.parse(raw_payload.replaceAll("'", "\""))
    return (raw_payload_json && raw_payload_json['configuration'] && raw_payload_json['configuration']['classifier_mode']) || 'N/A'
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
