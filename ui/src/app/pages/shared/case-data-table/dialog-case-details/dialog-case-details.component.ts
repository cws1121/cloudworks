import {Component, Input} from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-case-details',
  templateUrl: 'dialog-case-details.component.html',
  styleUrls: ['dialog-case-details.component.scss'],
})
export class DialogCaseDetailsComponent {

  @Input() record: any;

  constructor(protected ref: NbDialogRef<DialogCaseDetailsComponent>) {}

  dismiss() {
    this.ref.close();
  }
}
