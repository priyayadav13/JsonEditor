import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TransferService } from '../services/transfer.service';
import { ModifyJsonService } from '../services/modify-json.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseDialogComponent } from '../response-dialog/response-dialog.component';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.css']
})
export class TextAreaComponent implements OnInit {
  message: any = '';
  id: any = '';
  jsonText: string = '';
  jsonData: any = {};
  @ViewChild('contentDiv') codeEditorRef!: ElementRef<HTMLDivElement>;
  codeEditor: HTMLDivElement | undefined;
  editedData: string = '';
  searchTerm: string = '';
  searchText: string = '';
  searchValue: string = ''
  private subscription: Subscription = new Subscription();

  constructor(
    private transferData: TransferService,
    public modifyJson: ModifyJsonService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private sharedService: SharedService
  ) {
    this.subscription = this.sharedService.textAreaContent$.subscribe(content => {
      this.searchText = content;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.transferData.getMessage.subscribe((msg) => {
      this.message = msg;
      this.jsonText = this.message;
    });
    this.transferData.getId.subscribe((id) => {
      this.id = id;
    });

  }

  initializeEditorData() {
    this.codeEditor = this.codeEditorRef.nativeElement;
    this.editedData = this.codeEditor.innerText;
    this.jsonData.input = this.editedData;
  }

  searchText1(): any{
    if (this.searchValue) {
      let searchText = this.searchValue
      console.log(searchText)
      if (this.editedData && searchText) {
        var re = new RegExp(searchText, 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
        return this.editedData.replace(re, "<mark>$&</mark>");
      }else{
        return this.editedData
      }
    }
  }

    handleResponse(response: any, successMessage: string) {
      if (response.status == '200') {
        this._snackBar.open(response.message, 'More details', { duration: 5000 })
          .onAction().subscribe(() => {
            this.dialog.open(ResponseDialogComponent, { data: response.data });
          });
      } else {
        this._snackBar.open(response.error, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    }

    handleError(error: any, errorMessage: string) {
      this._snackBar.open(errorMessage, 'More details', { duration: 5000 })
        .onAction().subscribe(() => {
          this.dialog.open(ResponseDialogComponent, { data: error });
        });
    }

    ValidateClick() {
      this.initializeEditorData();
      this.modifyJson.validateData(this.jsonData).subscribe(
        response => this.handleResponse(response, 'Validation successful.'),
        error => this.handleError(error, 'Validation failed. Please try again.')
      );
    }

    QueryClick() {
      this.initializeEditorData();
      this.modifyJson.generateQuery(this.id, this.jsonData).subscribe(
        response => {
          const formattedJsonData = JSON.stringify(response.data, null, 2).replace(/'/g, "''");
          const sqlStatement = `UPDATE all_jsons SET json = '${formattedJsonData}' WHERE id = ${this.id}`;
          response.data = sqlStatement;  // Adjusting data for dialog display
          this.handleResponse(response, 'Query generation successful.');
        },
        error => this.handleError(error, 'Query generation failed. Please try again.')
      );
    }

    SaveClick() {
      this.initializeEditorData();
      this.modifyJson.updateJson(this.id, this.jsonData).subscribe(
        response => this.handleResponse(response, 'Json update successful.'),
        error => this.handleError(error, 'Json update failed. Please try again.')
      );
    }
  }
