import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/Cliente.interface';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'https://localhost:44307/';
  private api = 'api/Cliente/';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl + this.api);
  }

  saveCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl + this.api, cliente);
  }
  updareClient(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(this.apiUrl + this.api + id, cliente);
  }
  deleteCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(this.apiUrl + this.api + id);
  }
}
