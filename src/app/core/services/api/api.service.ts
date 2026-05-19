import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../../../../environments/environment';

type HttpParamValue = string | number | boolean | null | undefined;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = apiUrl;

  get<T>(
    path: string,
    params: Record<string, HttpParamValue> = {},
    responseType: 'json' | 'text' = 'json',
  ): Observable<T> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.append(key, value);
      }
    });

    return this.http.get<T>(`${this.baseUrl}${path}`, {
      params: httpParams,
      responseType: responseType as 'json',
    });
  }

  post<T>(path: string, body: unknown = {}, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, { headers });
  }
}
