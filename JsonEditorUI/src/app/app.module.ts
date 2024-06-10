import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ImplementButtonComponent } from './implement-button/implement-button.component';
import { CustombuttonComponent } from './custombutton/custombutton.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { JsonViewComponentComponent } from './json-view-component/json-view-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatDialogModule } from '@angular/material/dialog'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { ListComponent } from './tree-view/tree-view.component'
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResponseDialogComponent } from './response-dialog/response-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TextAreaComponent } from './text-area/text-area.component';
import { FormsModule } from '@angular/forms';
import {FilterPipe} from '../assets/filter.pipe'
@NgModule({
  declarations: [
    AppComponent,
    ImplementButtonComponent,
    CustombuttonComponent,
    NavbarComponent,
    HomeComponent,
    JsonViewComponentComponent,
    ListComponent,
    ResponseDialogComponent,
    TextAreaComponent,
    FilterPipe
  ],
  imports: [
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatDividerModule,
    MatTreeModule,
    RouterModule,
    HttpClientModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
