import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

const TOTAL_PAGES = 7;

export class ImagePost {
  title: string;
  link: string;
  creator: string;
  text: string;
}

@Injectable()
export class ImagesService {

  constructor(private http: HttpClient) {}

  load(page: number, pageSize: number): Observable<ImagePost[]> {
    const startIndex = ((page - 1) % TOTAL_PAGES) * pageSize;

    return this.http
      .get<ImagePost[]>('assets/data/images.json')
      .pipe(
        map(image => image.splice(startIndex, pageSize)),
        delay(1500),
      );
  }
}
