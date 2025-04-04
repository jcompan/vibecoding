// tipificador.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface TipoResponse {
  tipo: string;
  confianza?: number;
}

export interface CorreccionResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipificadorService {
  // URL base de la API (configurada en environment.ts)
  private apiUrl = environment.apiUrl + '/tipificador';
  
  constructor(private http: HttpClient) {}
  
  /**
   * Verifica el tipo de un ingreso basado en su concepto
   * @param concepto El concepto del ingreso a verificar
   * @returns Observable con la respuesta que contiene el tipo
   */
  verificarTipo(concepto: string): Observable<TipoResponse> {
    return this.http.post<TipoResponse>(`${this.apiUrl}/verificar`, { concepto });
  }
  
  /**
   * Corrige un tipo de ingreso detectado incorrectamente
   * @param datos Objeto con la información de corrección
   * @returns Observable con la respuesta de confirmación
   */
  corregirTipo(datos: {
    concepto: string;
    tipoOriginal: string;
    tipoCorregido: string;
  }): Observable<CorreccionResponse> {
    return this.http.post<CorreccionResponse>(`${this.apiUrl}/corregir`, datos);
  }
  
  /**
   * Obtiene sugerencias de tipos basados en un texto parcial
   * Esta función es útil para implementar autocompletado
   * @param texto Texto parcial para buscar sugerencias
   * @returns Observable con un array de sugerencias
   */
  obtenerSugerencias(texto: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/sugerencias`, {
      params: { texto }
    });
  }
}
