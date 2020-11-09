import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl = environment.base_url + '/api';
  readonly MediaUrl = environment.base_url + '/media';

  constructor(private http:HttpClient) {

  }

  getTestSessionList():Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl + '/test_session/');
  }

  addTestSession(val:any){
    return this.http.post(this.APIUrl + '/test_session/', val);
  }

  getTestResultList():Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl + '/test_result/');
  }
}
