import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private textAreaContentSubject = new Subject<string>();
  textAreaContent$ = this.textAreaContentSubject.asObservable();

  updateTextAreaContent(content: string) {
    console.log("servive",content)
    this.textAreaContentSubject.next(content);
  }
}