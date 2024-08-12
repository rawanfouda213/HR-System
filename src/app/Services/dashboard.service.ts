import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
private URL='http://localhost:5010/api/Dashboard'
  constructor(private http: HttpClient) {}
  getDashboardData(): Observable<any> {
    return this.http.get(this.URL);
  }
}