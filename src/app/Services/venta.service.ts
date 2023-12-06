import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../Interfaces/response-api';
import { Venta } from '../Interfaces/venta';
import { Console } from 'console';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private urlApi: string = environment.endpoint + "Venta/";

  constructor(private http: HttpClient) { }

  Guardar(request: Venta): Observable<ResponseApi> {
    
    console.log(request);
    
    return this.http.post<ResponseApi>(`${this.urlApi}Registrar`, request)
  }

  Historial(buscarPor: string, numeroVenta: string, fechaInicio: string, fechaFin: string): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Historial/${buscarPor}/${numeroVenta}/${fechaInicio}/${fechaFin}`)
  }

  Resumen(fechaInicio: string, fechaFin: string): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Resumen/${fechaInicio}/${fechaFin}`)
  }
}
