import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-response-dialog',
  templateUrl: './response-dialog.component.html',
  styleUrls: ['./response-dialog.component.css']
})
export class ResponseDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  copyToClipboard() {
    const el = document.createElement('textarea');
    el.value = this.data.json;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
