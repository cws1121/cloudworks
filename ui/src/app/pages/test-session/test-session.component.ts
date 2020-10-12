import { Component, OnInit } from '@angular/core';
import { SharedService } from "../../shared.service";


@Component({
  selector: 'ngx-test-session',
  templateUrl: './test-session.component.html',
  styleUrls: ['./test-session.component.scss']
})
export class TestSessionComponent implements OnInit {

  constructor(private service:SharedService) { }

  TestSessionList:any = []

  ngOnInit(): void {
    this.refreshTestSessionList();
  }

  refreshTestSessionList(){
    this.service.getTestSessionList().subscribe(data=>{
      this.TestSessionList = data;
    })
  }

}
