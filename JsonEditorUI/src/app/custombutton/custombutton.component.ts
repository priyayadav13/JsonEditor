import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custombutton',
  templateUrl: './custombutton.component.html',
  styleUrls: ['./custombutton.component.css'],
})
export class CustombuttonComponent {
  @Input() label: any;

  @Output() onClick = new EventEmitter<void>();
}
