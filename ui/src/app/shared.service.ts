import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
import {environment} from '../environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly NgAPIUrl = environment.base_url + '/ng';

  //init date range
  startDate = moment().subtract(30, 'days');
  endDate = moment();

  private contextStream = new BehaviorSubject<any>([]);
  currentContext = this.contextStream.asObservable();

  constructor(private http: HttpClient) {

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

  getTestSessionList(): Observable<any[]> {
    return this.http.get<any[]>(this.NgAPIUrl + '/test_session_list/');
  }

  // addTestSession(val: any) {
  //   return this.http.post(this.NgAPIUrl + '/test_session/', val);
  // }
  //
  // getTestResultList(): Observable<any[]> {
  //   return this.http.get<any[]>(this.NgAPIUrl + '/test_result/');
  // }
}
