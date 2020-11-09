import { Component } from '@angular/core';
import { ImagesService } from '../images.service';

@Component({
  selector: 'ngx-images',
  templateUrl: 'images.component.html',
  styleUrls: ['images.component.scss'],
})
export class ImagesComponent {

  firstCard = {
    images: [],
    placeholders: [],
    loading: false,
    pageToLoadNext: 1,
  };
  secondCard = {
    images: [],
    placeholders: [],
    loading: false,
    pageToLoadNext: 1,
  };
  pageSize = 10;

  constructor(private ImagesService: ImagesService) {}

  loadNext(cardData) {
    if (cardData.loading) { return; }

    cardData.loading = true;
    cardData.placeholders = new Array(this.pageSize);
    this.ImagesService.load(cardData.pageToLoadNext, this.pageSize)
      .subscribe(nextImage => {
        cardData.placeholders = [];
        cardData.images.push(...nextImage);
        cardData.loading = false;
        cardData.pageToLoadNext++;
      });
  }
}
