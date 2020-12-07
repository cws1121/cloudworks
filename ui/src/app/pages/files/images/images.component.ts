import {Component, OnInit} from '@angular/core';
import {ImagesService} from '../images.service';
import {SharedService} from '../../../shared.service';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'ngx-images',
  templateUrl: 'images.component.html',
  styleUrls: ['images.component.scss'],
})
export class ImagesComponent implements OnInit {

  secondCard = {
    images: [],
    placeholders: [],
    loading: false,
    pageToLoadNext: 1,
  };
  pageSize = 10;

  constructor(private ImagesService: ImagesService, private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.sharedService.rdtImagesList
      .subscribe(images => this.reload());
  }

  loadNext() {
    if (this.secondCard.loading) {
      return;
    }

    this.secondCard.loading = true;
    this.secondCard.placeholders = new Array(this.pageSize);

    const startIndex = (this.secondCard.pageToLoadNext - 1) * this.pageSize;
    return this.sharedService.rdtImagesList
      .pipe(
        filter(images => !!images.data),
        map(images => images['data']['rdt_images']
          // .splice(startIndex, this.pageSize)
        ),
      ).subscribe(nextImage => {
        this.secondCard.placeholders = [];
        // this.secondCard.images.push(...nextImage);
        this.secondCard.images = nextImage;
        this.secondCard.loading = false;
        this.secondCard.pageToLoadNext++;
      });
  }

  reload(){
    this.secondCard.pageToLoadNext=1
    this.secondCard.images=[]
  }

  // ngOnDestroy() {
  //   if (this.routesSubscription) {
  //     this.routesSubscription.unsubscribe();
  //   }
  // }
}
