import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, config } from 'rxjs';
import { API_BASE_URL } from '../../../config'

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  constructor(private http: HttpClient) { }

  getList(): Observable<any> {
    let url = `${API_BASE_URL.url}/treeview`
    return this.http.get<any>(url)
  }

  getJson(id: any) {
    let url = `${API_BASE_URL.url}/getJsonbyId?id=${id}`
    return this.http.get<any>(url)
  }
}

