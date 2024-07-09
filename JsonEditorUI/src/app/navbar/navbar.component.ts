import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TransferService } from '../services/transfer.service';
import { SharedService } from '../services/shared.service';

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

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void { }

  onInput() {
    this.isButtonEnabled = this.searchText.trim().length > 0;
  }

  onSearch(searchText: string) {
    this.sharedService.updateTextAreaContent(searchText);
  }
}
