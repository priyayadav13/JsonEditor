import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private message = new BehaviorSubject<any>(null); 
  getMessage = this.message.asObservable()
  private id = new BehaviorSubject<any>(null)
  getId = this.id.asObservable()

  private filteredDataSubject = new BehaviorSubject<any[]>([]);
  filteredData$ = this.filteredDataSubject.asObservable();

  setMessage(message:any){
    this.message.next(message)
  }

  setId(id:any){
    this.id.next(id)
  }
}

