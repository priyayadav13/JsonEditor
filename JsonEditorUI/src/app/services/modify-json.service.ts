import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../config'

@Injectable({
  providedIn: 'root'
})
export class ModifyJsonService {
  constructor(private http: HttpClient) { }

  updateJson(id: number, data: any): Observable<any> {
    let url = `${API_BASE_URL.url}/json/${id}`;
    return this.http.put<any>(url, data);
  }

  generateQuery(id: number, data: any): Observable<any> {
    let url = `${API_BASE_URL.url}/Query/${id}`;
    return this.http.post<any>(url, data);
  }

  validateData(data: any): Observable<any> {
    let url = `${API_BASE_URL.url}/jsonValidation`;
    return this.http.post<any>(url, data);
  }
}
