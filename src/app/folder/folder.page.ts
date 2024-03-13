import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CondicionActService } from '../services/condicionAct/condicion-act.service';
import { ObtenerLocalidaqdService } from "../services/obtenerLocalidad/obtener-localidaqd.service";
import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
 
  // VARIABLES
  coordenadas: any;
  distanciaMinima = Infinity;
  puntoMasCercano: any;
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  codigoLocalidad: any;
  nombreLocalidad: any;
  datosPronosLocalidad: any;
  objetoCondicion: any;
  condicionTexto: any

  constructor(private condicion: CondicionActService,private pronosticoLocalidad : ObtenerLocalidaqdService)
               {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string; 

    // Llama a obtenerUbicacionActual aquí
    this.obtenerUbicacionActual().then(() => {
      // Coloca la lógica que depende de las coordenadas aquí
      this.condicion.getDataLocalidad().subscribe((localidad) => {
        localidad.forEach((element: { latitud: number; longitud: number; }) => {
          // Accede a this.coordenadas.latitude y this.coordenadas.longitude aquí
          const distancia = this.haversine(-54.636317, -69.6884299, element.latitud, element.longitud)
          if (distancia < this.distanciaMinima) {
            this.distanciaMinima = distancia;
            this.puntoMasCercano = element;
            console.log('Punto más cercano:', this.puntoMasCercano, " con distancia de : ", this.distanciaMinima);
          }
        })
        console.log("finalmente la distancia minima es: ", this.distanciaMinima, "En la localidad de : ", this.puntoMasCercano);
        this.codigoLocalidad = this.puntoMasCercano.codigo;
        this.pronosticoLocalidad.obtenerLocalidadCompleta(this.codigoLocalidad).subscribe((localidad) =>{
          this.datosPronosLocalidad = localidad.data[0];
          console.log("pronostico localidad", this.datosPronosLocalidad);
          this.nombreLocalidad = this.datosPronosLocalidad.nombre;
          this.objetoCondicion = this.datosPronosLocalidad.condicionActual;
          console.log("objeto condicion", this.objetoCondicion);
          this.condicionTexto=this.objetoCondicion.condicionTexto.toLowerCase();
        });
      });
      
    });


    
  }

  async obtenerUbicacionActual() {
    try {
      const opciones: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
      };

      const posicion: Position = await Geolocation.getCurrentPosition(opciones);
      // Asigna las coordenadas obtenidas a la variable coordenadas
      this.coordenadas = {
        latitude: posicion.coords.latitude,
        longitude: posicion.coords.longitude
      };
      console.log('Ubicación obtenida aqui:', this.coordenadas);
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distancia en kilómetros
    return d;
  }

  

}