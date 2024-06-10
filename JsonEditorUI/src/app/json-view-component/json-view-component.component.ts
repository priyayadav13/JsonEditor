import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TransferService } from '../services/transfer.service';
import { ModifyJsonService } from '../services/modify-json.service';
import { HttpClient } from '@angular/common/http';
import { ResponseDialogComponent } from '../response-dialog/response-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-json-view-component',
  templateUrl: './json-view-component.component.html',
  styleUrls: ['./json-view-component.component.css'],
})
export class JsonViewComponentComponent implements AfterViewInit, OnInit {
  lineNumbers: string = '<span>1</span>';
  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;
  message: any = '';
  id: any = '';
  snackBar: any;
  
  jsonText: string = '';
  jsonData: any = {};

  constructor(private transferData: TransferService, public modifyJson: ModifyJsonService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.transferData.getMessage.subscribe((msg) => {
      this.message = msg;
      this.updateRowNumbers();
    });
    this.transferData.getId.subscribe((id) => {
      this.id = id;
    });
  }

  ngAfterViewInit(): void {
    const codeEditor = this.textareaRef.nativeElement;
    const textarea = document.getElementById('codeEditor') as HTMLTextAreaElement;
    this.jsonText = textarea.value;
    this.jsonData = {
      input: this.jsonText
    };

    codeEditor.addEventListener('input', () => {
      this.updateCursorPosition();
    });

    codeEditor.addEventListener('scroll', this.syncScroll.bind(this));

    this.textareaRef.nativeElement.addEventListener('keyup', (event) => this.onKeyup(event));
    this.textareaRef.nativeElement.addEventListener('keydown', (event) => this.onKeydown(event));
  }

  onKeyup(event: KeyboardEvent): void {
    this.updateRowNumbers();
  }

  onKeydown(event: KeyboardEvent): void {
    const textarea = this.textareaRef.nativeElement;
    if (event.key === 'Tab') {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      textarea.value =
        textarea.value.substring(0, start) +
        '\t' +
        textarea.value.substring(end);

      textarea.selectionStart = textarea.selectionEnd = start + 1;

      event.preventDefault();
    }
  }

  updateRowNumbers(): void {
    const codeEditor = this.textareaRef.nativeElement;
    const lines = codeEditor.value.split('\n');
    this.lineNumbers = lines.map((_, index) => `<span>${index + 1}</span>`).join('');
  }

  updateCursorPosition(): void {
    const codeEditor = this.textareaRef.nativeElement;
    const cursorPosition = document.getElementById('cursorPosition')!;
    const selectionStart = codeEditor.selectionStart;
    const lines = codeEditor.value.substring(0, selectionStart).split('\n');
    const row = lines.length;
    const col = selectionStart - lines[lines.length - 1].length;
    cursorPosition.innerText = `Cursor Position: Row ${row}, Column ${col}`;
  }

  syncScroll(): void {
    const codeEditor = this.textareaRef.nativeElement;
    const rowNumbers = document.getElementById('rowNumbers')!;
    rowNumbers.scrollTop = codeEditor.scrollTop;
  }

  ValidateClick() {
    this.modifyJson.validateData(this.jsonData).subscribe(
      response => {
        if (response.status == '200') {
          this._snackBar.open(response.message, 'More details', {
            duration: 5000,
          }).onAction().subscribe(() => {
            this.dialog.open(ResponseDialogComponent, {
              data: response.data
            });
          })
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
    this.modifyJson.generateQuery(this.id, this.jsonData).subscribe(
      response => {
        if (response.status == '200') {
          this._snackBar.open(response.message, 'More details', {
            duration: 5000,
          }).onAction().subscribe(() => {
            this.dialog.open(ResponseDialogComponent, {
              data: response.data
            });
          })
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
    this.modifyJson.updateJson(this.id, JSON.stringify(this.message)).subscribe(
      response => {
        console.log('Validate Data Response:', response);
      },
      error => {
        console.error('Validate Data Error:', error);
      }
    );
  }
}
