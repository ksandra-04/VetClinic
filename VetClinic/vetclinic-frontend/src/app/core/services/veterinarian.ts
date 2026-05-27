import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Veterinarian {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  licenseNumber: string;
  phone: string;
  createdAt: string;
}

export interface VeterinarianRequest {
  firstName: string;
  lastName: string;
  specialty: string;
  licenseNumber: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class VeterinarianService {
  private apiUrl = 'http://localhost:5000/api/Veterinarian';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Veterinarian[]> {
    return this.http.get<Veterinarian[]>(this.apiUrl);
  }

  create(dto: VeterinarianRequest): Observable<Veterinarian> {
    return this.http.post<Veterinarian>(this.apiUrl, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
