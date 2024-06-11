import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TransferService } from '../services/transfer.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchText: string = '';
  isButtonEnabled: boolean = false;
  message: string = '';
  filteredData: string = '';

  @Output() searchTextChange = new EventEmitter<string>();

  constructor(private transferData: TransferService) { }

  ngOnInit(): void {
    this.transferData.getMessage.subscribe((msg: string) => {
      this.message = msg;
      this.filteredData = msg;
    });
  }

  onInput() {
    this.isButtonEnabled = this.searchText.trim().length > 0;
  }

  onSearch(searchText: string) {
    if (!searchText) {
      this.filteredData = this.message;
    } else {
      this.filteredData = this.message.split(' ')
        .filter(word => word.toLowerCase().includes(searchText.toLowerCase()))
        .join(' ');
    }
    this.searchTextChange.emit(this.filteredData);
  }
}
