import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  id: number;
  petId: number;
  petName: string;
  ownerFullName: string;
  veterinarianId: number;
  veterinarianFullName: string;
  veterinarianSpecialty: string;
  appointmentDate: string;
  status: number;
  reason: string;
  notes?: string;
  hasMedicalRecord: boolean;
  createdAt: string;
}

export interface AppointmentRequest {
  petId: number;
  veterinarianId: number;
  appointmentDate: string;
  reason: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = 'http://localhost:5065/api/Appointment';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  create(dto: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, dto);
  }

  updateStatus(id: number, status: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
