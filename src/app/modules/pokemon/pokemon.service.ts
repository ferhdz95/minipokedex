import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Pokemon, PokemonResponse, PokemonResult } from './pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl: string = "https://pokeapi.co/api/v2";
  private pageLimit: number = 60;
  cache = [];
  constructor(private http: HttpClient) { }

  getPokemonsPaginated(offset: number, limitPage: number): Observable<PokemonResponse | undefined> {
    let url =  `${this.baseUrl}/pokemon?offset=${offset}&limit=${this.pageLimit}`;
    return this.http.get<PokemonResponse>(url).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  getPokemonByID(id: string): Observable<Pokemon | undefined> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`).pipe(
      tap(data => {
        this.cache = this.cache ? [...this.cache, data] : [data];
      }),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
