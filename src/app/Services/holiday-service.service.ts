import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HolidayServiceService {
  constructor(private httpClient: HttpClient) {}
  getHolidays() {
    return this.httpClient.get('http://localhost:5010/api/Holiday');
  }
  addHoliday(model: any) {
    return this.httpClient.post(
      'http://localhost:5010/api/Holiday/AddHoliday',
      model
    );
  }
  editHoliday(model: any) {
    return this.httpClient.post(
      'http://localhost:5010/api/Holiday/UpdateHoliday',
      model
    );
  }
  deleteHoliday(id: any) {
    return this.httpClient.post(
      'http://localhost:5010/api/Holiday/DeleteHoliday',
      id
    );
  }
}
