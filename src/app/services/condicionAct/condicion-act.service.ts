import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CondicionActService {

  apiCondicion = 'http://archivos.meteochile.gob.cl/dmc-movil/localidad/getAll';


  constructor(private http: HttpClient) { }

  getDataLocalidad(){
    const noCacheUrl = `${this.apiCondicion}?_t=${new Date().getTime()}`;
    const resultado  = this.http.get<any>(noCacheUrl);
    return resultado;
  }

}
