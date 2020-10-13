import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  APIUrl = 'http://127.0.0.1:8000/api';
  MediaUrl = 'http://127.0.0.1:8000/media';

  constructor(private http:HttpClient) {
    if (!isDevMode){
      this.APIUrl = 'http://34.214.161.14/api';
      this.MediaUrl = 'http://34.214.161.14/media';
    }
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
