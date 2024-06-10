import { Component } from '@angular/core';

@Component({
  selector: 'app-implement-button',
  templateUrl: './implement-button.component.html',
  styleUrls: ['./implement-button.component.css'],
})
export class ImplementButtonComponent {
  ValidateClick() {
    alert('Validate Button Clicked!');
  }
  QueryClick() {
    alert('Query Button Clicked');
  }
  SaveClick() {
    alert('Save button clicked');
  }
}
