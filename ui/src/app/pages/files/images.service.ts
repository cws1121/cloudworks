import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {delay, filter, map} from 'rxjs/operators';
import { SharedService } from '../../shared.service';

export class ImagePost {
  file: string;
  uploaded_at: string;
  external_id: string;
}

@Injectable()
export class ImagesService {

  constructor(private sharedService: SharedService) {}

  load(page: number, pageSize: number): Observable<ImagePost[]> {
    console.log()
    console.log(page)

    const startIndex = (page - 1) * pageSize;

    return this.sharedService.rdtImagesList
      .pipe(
        filter(images => !!images.data),
        map(images => images['data']['rdt_images'].splice(startIndex, pageSize)),
      )
  }
}
