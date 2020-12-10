import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../environments/environment';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly NgAPIUrl = environment.base_url + '/ng';

  dateRange = {startDate: moment().subtract(30, 'days'), endDate: moment()};

  private contextStream = new BehaviorSubject<any>([]);
  currentContext = this.contextStream.asObservable();

  private testResultStream = new BehaviorSubject<any>([]);
  testResultList = this.testResultStream.asObservable();

  private rdtImagesStream = new BehaviorSubject<any>([]);
  rdtImagesList = this.rdtImagesStream.asObservable();

  private dashboardStatsStream = new BehaviorSubject<any>([]);
  dashboardStats = this.dashboardStatsStream.asObservable();

  constructor(private http: HttpClient) {
    this.updateContext();
    this.reloadDateRange();
  }

  updateContext() {
    this.http
      .post(this.NgAPIUrl + '/context/', [])
      .subscribe(
        (data: any) => {
          this.contextStream.next(data);
        },
        (err: any) => console.error('updateContext: ERROR')
      );
  }

  updateTestResultList() {
    this.http
      .post(this.NgAPIUrl + '/test_result_list/', {
        start_date: this.dateRange.startDate.format('YYYY-MM-DD'),
        end_date: this.dateRange.endDate.format('YYYY-MM-DD'),
      })
      .subscribe(
        (data: any) => {
          this.testResultStream.next(data);
        },
        (err: any) => console.error('updateTestResultList: ERROR')
      );
  }

  updateRdtImagesList() {
    this.http
      .post(this.NgAPIUrl + '/rdt_images_list/', {
        start_date: this.dateRange.startDate.format('YYYY-MM-DD'),
        end_date: this.dateRange.endDate.format('YYYY-MM-DD'),
      })
      .subscribe(
        (data: any) => {
          this.rdtImagesStream.next(data);
        },
        (err: any) => console.error('rdtImagesList: ERROR')
      );
  }

  updateDashboardStats() {
    this.http
      .post(this.NgAPIUrl + '/dashboard_stats/', {
        start_date: this.dateRange.startDate.format('YYYY-MM-DD'),
        end_date: this.dateRange.endDate.format('YYYY-MM-DD'),
      })
      .subscribe(
        (data: any) => {
          this.dashboardStatsStream.next(data);
        },
        (err: any) => console.error('rdtImagesList: ERROR')
      );
  }

  reloadDateRange() {
    this.updateTestResultList();
    this.updateRdtImagesList();
    this.updateDashboardStats();
  }
}
