import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeSlot } from '../appointment/time-slot.model';
import { Appointment } from '../appointment/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private baseUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  getTimeSlots(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/timeslots`);
  }

  getTreatments(): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:8080/api/treatments`);
  }

  searchAppointments(name: string, id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search?name=${name}&id=${id}`);
  }

  filterAppointments(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/filter?date=${date}`);
  }

  updateAppointment(id: number, appointmentData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, appointmentData);
  }
}
