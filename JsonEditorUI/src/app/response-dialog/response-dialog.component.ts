import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-response-dialog',
  templateUrl: './response-dialog.component.html',
  styleUrls: ['./response-dialog.component.css']
})
export class ResponseDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }


  copyToClipboard() {
    const el = document.createElement('textarea');
    if (typeof this.data === 'object') {
      el.value = JSON.stringify(this.data, null, 2); 
  } else {
      el.value = this.data;
  }
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
