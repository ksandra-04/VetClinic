import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  petsCount: number;
  createdAt: string;
}

export interface OwnerRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class OwnerService {
  private apiUrl = 'http://localhost:5065/api/Owner';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Owner[]> {
    return this.http.get<Owner[]>(this.apiUrl);
  }

  getById(id: number): Observable<Owner> {
    return this.http.get<Owner>(`${this.apiUrl}/${id}`);
  }

  create(dto: OwnerRequest): Observable<Owner> {
    return this.http.post<Owner>(this.apiUrl, dto);
  }

  update(id: number, dto: OwnerRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
