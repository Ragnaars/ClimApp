import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
@Injectable({
  providedIn: 'root'
})
export class ObtenerLocalidaqdService {

  url = 'http://archivos.meteochile.gob.cl/dmc-movil/api/v1/localidad/';
  constructor(private http: HttpClient) { }

  obtenerLocalidadCompleta(codigoRegion: string) {
    const noCacheUrl = `${this.url}${codigoRegion}/pronostico?_t=${new Date().getTime()}`;
    const resultado  = this.http.get<any>(noCacheUrl);
    return resultado;
  }

}
