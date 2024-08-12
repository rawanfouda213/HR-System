import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralSettingsServiceService {

  constructor(private http: HttpClient) {}
  // GetSettings() {
  //   return this.http.get('http://localhost:17828/api/Auth/GetAllRoles');
  // }
  // saveSettings(model: any) {
  //   return this.http.post('http://localhost:17828/api/Auth/GetAllRoles', model);
  // }

  GetSettings() {
    return this.http.get('http://localhost:5010/api/GeneralSettings');
  }
  saveSettings(model: any) {
    return this.http.post('http://localhost:5010/api/GeneralSettings', model);
  }

  getWeekendDays(): Observable<any> {
    return this.http.get<any>('http://localhost:5010/api/GeneralSettings');
  }

}
