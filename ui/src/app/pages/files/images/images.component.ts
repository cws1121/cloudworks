import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../../shared.service';
import {filter, map} from 'rxjs/operators';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
  selector: 'ngx-images',
  templateUrl: 'images.component.html',
  styleUrls: ['images.component.scss'],
})
export class ImagesComponent implements OnInit {

  dataCard: any;
  pageSize: number;
  pageLoaded: Subject<boolean> = new BehaviorSubject(false);

  constructor(private sharedService: SharedService) {
    this.dataCard = {
      images: [],
      placeholders: [],
      loading: false,
      pageToLoadNext: 1,
    };
    this.pageSize = 10;
  }

  ngOnInit(): void {
    this.sharedService.rdtImagesList
      .subscribe(images => this.reload());
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pageLoaded.next(true);
    },);
  }

  loadNext() {
    if (this.dataCard.loading) {
      return;
    }

    this.dataCard.loading = true;
    this.dataCard.placeholders = new Array(this.pageSize);

    let startIndex = (this.dataCard.pageToLoadNext - 1) * this.pageSize;
    console.log(startIndex);
    return this.sharedService.rdtImagesList
      .pipe(
        filter(images => !!images.data),
        map(images => images['data']['rdt_images']
          // .splice(startIndex, this.pageSize)
        ),
      ).subscribe(nextImage => {
        this.dataCard.placeholders = [];
        // this.dataCard.images.push(...nextImage);
        this.dataCard.images = nextImage;
        this.dataCard.loading = false;
        this.dataCard.pageToLoadNext++;
      });
  }

  reload() {
    this.dataCard.pageToLoadNext = 1;
    this.dataCard.images = [];
  }

  // ngOnDestroy() {
  //   if (this.routesSubscription) {
  //     this.routesSubscription.unsubscribe();
  //   }
  // }
}
