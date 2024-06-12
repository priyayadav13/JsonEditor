import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TransferService } from '../services/transfer.service';
import { ModifyJsonService } from '../services/modify-json.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseDialogComponent } from '../response-dialog/response-dialog.component';

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

  constructor(
    private transferData: TransferService,
    public modifyJson: ModifyJsonService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.transferData.getMessage.subscribe((msg) => {
      this.message = msg;
      this.jsonText = this.message;
    });
    this.transferData.getId.subscribe((id) => {
      this.id = id;
    });
  }

  ValidateClick() {
    this.jsonData.input = this.jsonText;
    this.modifyJson.validateData(this.jsonData).subscribe(
      response => {
        if (response.status == '200') {
          this._snackBar.open(response.message, 'More details', {
            duration: 5000,
          }).onAction().subscribe(() => {
            this.dialog.open(ResponseDialogComponent, {
              data: response.data
            });
          });
        }
        else {
          this._snackBar.open(response.error, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error => {
        this._snackBar.open('Validation failed. Please try again.', 'More details', {
          duration: 5000,
        }).onAction().subscribe(() => {
          this.dialog.open(ResponseDialogComponent, {
            data: error
          });
        });
      }
    );
  }

  QueryClick() {
    this.jsonData.input = this.jsonText;
    this.modifyJson.generateQuery(this.id, this.jsonData).subscribe(
      response => {
        const formattedJsonData = JSON.stringify(response.data, null, 2).replace(/'/g, "''");
        const sqlStatement = `UPDATE all_jsons SET json = '${formattedJsonData}' WHERE id = ${this.id}`;
        if (response.status == '200') {
          this._snackBar.open(response.message, 'More details', {
            duration: 5000,
          }).onAction().subscribe(() => {
            this.dialog.open(ResponseDialogComponent, {
              data: sqlStatement
            });
          });
        }
        else {
          this._snackBar.open(response.error, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error => {
        this._snackBar.open('Query generation failed. Please try again.', 'More details', {
          duration: 5000,
        }).onAction().subscribe(() => {
          this.dialog.open(ResponseDialogComponent, {
            data: error
          });
        });
      }
    );
  }

  SaveClick() {
    this.jsonData.input = this.jsonText;
    this.modifyJson.updateJson(this.id, this.jsonData).subscribe(
      response => {
        if (response.status == '200') {
          this._snackBar.open(response.message, 'More details', {
            duration: 5000,
          }).onAction().subscribe(() => {
            this.dialog.open(ResponseDialogComponent, {
              data: response.data
            });
          });
        }
        else {
          this._snackBar.open(response.error, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error => {
        this._snackBar.open('Json Updation failed. Please try again.', 'More details', {
          duration: 5000,
        }).onAction().subscribe(() => {
          this.dialog.open(ResponseDialogComponent, {
            data: error
          });
        });
      }
    );
  }
}
