import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CondicionActService } from '../services/condicionAct/condicion-act.service';
import { ObtenerLocalidaqdService } from "../services/obtenerLocalidad/obtener-localidaqd.service";
import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';
import { InfiniteScrollCustomEvent } from '@ionic/angular';


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
  ciudades: any;
  currentPage: number = 1;
  cidudadesPerPage: number = 10
  pronosticos: any;



  constructor(private condicion: CondicionActService, private pronosticoLocalidad: ObtenerLocalidaqdService) {

    this.loadData();

  }

  loadData(event?: any) {
    this.condicion.getDataLocalidad().subscribe((localidad) => {
      this.ciudades = localidad;
      setTimeout(() => {
        for (let i = 0; i < this.cidudadesPerPage; i++) {
          this.ciudades.push(`Item ${this.ciudades.length + 1}`);
        }
        if (event) {
          event.target.complete(); // Mark the end of the data loading operation
        }
      }, 1000); // Simulate a 1-second delay to load the data

      this.currentPage++; // Increment the page number for the next load
    });
  }



  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    console.log(this.folder);

    // Llama a obtenerUbicacionActual aquí
    this.obtenerUbicacionActual().then(() => {
      // Coloca la lógica que depende de las coordenadas aquí
      this.condicion.getDataLocalidad().subscribe((localidad) => {
        this.ciudades = localidad;
        console.log("ciudades", this.ciudades);
        localidad.forEach((element: { latitud: number; longitud: number; }) => {
          // Accede a this.coordenadas.latitude y this.coordenadas.longitude aquí
          const distancia = this.haversine(-75, -74, element.latitud, element.longitud)
          if (distancia < this.distanciaMinima) {
            this.distanciaMinima = distancia;
            this.puntoMasCercano = element;
            console.log('Punto más cercano:', this.puntoMasCercano, " con distancia de : ", this.distanciaMinima);
          }
        })
        console.log("finalmente la distancia minima es: ", this.distanciaMinima, "En la localidad de : ", this.puntoMasCercano);
        this.codigoLocalidad = this.puntoMasCercano.codigo;
        this.pronosticoLocalidad.obtenerLocalidadCompleta(this.codigoLocalidad).subscribe((localidad) => {
          this.datosPronosLocalidad = localidad.data[0];
          console.log("pronostico localidad", this.datosPronosLocalidad);
          this.pronosticos = this.datosPronosLocalidad.pronostico
          this.nombreLocalidad = this.datosPronosLocalidad.nombre;
          this.objetoCondicion = this.datosPronosLocalidad.condicionActual;
          console.log("objeto condicion", this.objetoCondicion);
          this.condicionTexto = this.objetoCondicion.condicionTexto.toLowerCase().replace(/\s/g, '');
          console.log("condicion texto", this.condicionTexto);
        });
      });
    });

  }

  // Función para obtener la ubicación actual
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


  // Función para convertir grados a radianes
  toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }


  // Función para calcular la distancia entre dos puntos en la Tierra
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

  // Función para generar items




}