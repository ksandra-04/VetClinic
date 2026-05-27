import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pet {
  id: number;
  name: string;
  type: number;
  typeName: string;
  breed: string;
  birthDate: string;
  ownerId: number;
  ownerFullName: string;
  appointmentsCount: number;
  createdAt: string;
}

export interface PetRequest {
  name: string;
  type: number;
  breed: string;
  birthDate: string;
  ownerId: number;
}

@Injectable({ providedIn: 'root' })
export class PetService {
  private apiUrl = 'http://localhost:5000/api/Pet';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.apiUrl);
  }

  getById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`);
  }

  create(dto: PetRequest): Observable<Pet> {
    return this.http.post<Pet>(this.apiUrl, dto);
  }

  update(id: number, dto: PetRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
