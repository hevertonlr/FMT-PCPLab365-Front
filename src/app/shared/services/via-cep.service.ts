import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError, timeout } from 'rxjs';
import { Address } from '../interfaces/address';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ViaCepService {
  private URL_BASE = environment.useViaCep ? '/viacep' : '/opencep';
  private URL_SUFIX = environment.useViaCep ? '/json' : '.json';
  constructor(private http: HttpClient) {}
  getAddress = (cep: string): Observable<Address> => {
    if (!cep) return {} as Observable<Address>;
    return this.http
      .get(`${this.URL_BASE}/${cep.replace(/\D/g, '')}${this.URL_SUFIX}`)
      .pipe(
        timeout(5000),
        map((response) => this.toAddress(response)),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  };

  private toAddress = (response: any): Address =>
    ({
      city: response.localidade,
      state: response.uf,
      street: response.logradouro,
      complement: response.complemento,
      neighborhood: response.bairro,
    }) as Address;
}
