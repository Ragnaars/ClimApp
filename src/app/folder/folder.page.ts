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
  pronosticoSeleccionado: any;
  ciudadSeleccionada: any;



  constructor(
    private condicion: CondicionActService,
    private pronosticoLocalidad: ObtenerLocalidaqdService) {
    // Llama a infiniteScrollCiudades aquí para que se cargue la lista de ciudades al iniciar la aplicación
    this.obtenerUbicacionActual();
    this.infiniteScrollCiudades();

  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    // Llama a obtenerUbicacionActual aquí
  }

  //FUNCIONES PARA OBTENER UBICACION ACTUAL Y PRONOSTICO DE LOCALIDAD MAS CERCANA

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
      //DESPUES DE OBTENER LAS COORDENADAS:
      // Coloca la lógica que depende de las coordenadas aquí
      this.obtenerLocalicacionMasCercana();
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

  // Función para obtener la localidad más cercana
  obtenerLocalicacionMasCercana() {
    this.condicion.getDataLocalidad().subscribe((localidad) => {
      this.ciudades = localidad;
      console.log("ciudades", this.ciudades);

      // Itera sobre el arreglo de localidades
      localidad.forEach((element: { latitud: number; longitud: number; }) => {
        // Calcula la distancia entre la ubicación actual y cada localidad
        const distancia = this.haversine(-75, -74, element.latitud, element.longitud)

        // Compara la distancia con this.distanciaMinima y actualiza si es menor
        if (distancia < this.distanciaMinima) {
          this.distanciaMinima = distancia;
          this.puntoMasCercano = element;
          console.log('Punto más cercano:', this.puntoMasCercano, " con distancia de : ", this.distanciaMinima);
        }
      })

      console.log("finalmente la distancia minima es: ", this.distanciaMinima, "En la localidad de : ", this.puntoMasCercano);
      this.codigoLocalidad = this.puntoMasCercano.codigo;

      // Llama a obtenerDatosPronostico aquí gracias a que ya se tiene el código de la localidad más cercana
      this.obtenerDatosPronostico();
    });
  }

  // Función para obtener los datos del pronóstico de la localidad más cercana 
  obtenerDatosPronostico() {
    this.pronosticoLocalidad.obtenerLocalidadCompleta(this.codigoLocalidad)
      .subscribe((localidad) => {
        this.datosPronosLocalidad = localidad.data[0];
        this.pronosticos = this.datosPronosLocalidad.pronostico;
        this.nombreLocalidad = this.datosPronosLocalidad.nombre;
        this.objetoCondicion = this.datosPronosLocalidad.condicionActual;
        this.condicionTexto = this.objetoCondicion.condicionTexto.toLowerCase().replace(/\s/g, '');
        console.log("objeto condicion", this.objetoCondicion);
        console.log("condicion texto", this.condicionTexto);
        console.log("pronostico localidad", this.datosPronosLocalidad);
        console.log("datos", localidad);
      });
  }

  //FUNCIONES PARA LISTA DE CIUDADES  
  //FUNCIONES PARA LISTA DE CIUDADES  
  //FUNCIONES PARA LISTA DE CIUDADES  
  //FUNCIONES PARA LISTA DE CIUDADES   
  //FUNCIONES PARA LISTA DE CIUDADES  
  //FUNCIONES PARA LISTA DE CIUDADES  

  infiniteScrollCiudades(event?: any) {
    this.condicion.getDataLocalidad().subscribe((localidad) => {
      this.ciudades = localidad;
      setTimeout(() => {
        for (let i = 0; i < this.cidudadesPerPage; i++) {
          if (this.ciudades.length < localidad.length) {
            this.ciudades.push(localidad[this.ciudades.length]);
          }
        }
        if (event) {
          event.target.complete(); // Mark the end of the data loading operation
        }
      }, 1000); // Simulate a 1-second delay to load the data

      this.currentPage++; // Increment the page number for the next load
    });
  }

// Función que se llama al seleccionar una ciudad y obtener su pronóstico
seleccionarCiudad(ciudad: any) {
  // Asigna la ciudad seleccionada a la variable ciudadSeleccionada
  this.ciudadSeleccionada = ciudad;
  // Muestra en la consola la ciudad seleccionada
  console.log("Ciudad seleccionada:", ciudad);
  // Llama al servicio para obtener el pronóstico de la localidad y suscribe una función al observable que maneja la respuesta del servicio
  this.pronosticoLocalidad.obtenerLocalidadCompleta(ciudad.codigo)
    .subscribe((pronostico) => {
      // Verifica si se obtuvieron datos del pronóstico
      if (pronostico && pronostico.data && pronostico.data.length > 0) {
        // Asigna el primer conjunto de datos del pronóstico a la variable pronosticoSeleccionado
        this.pronosticoSeleccionado = pronostico.data[0];
        // Resto del código para manejar los datos del pronóstico...
      } else {
        // Si no se encontraron datos del pronóstico, asigna null a pronosticoSeleccionado
        console.log("No se encontraron datos del pronóstico para", ciudad.nombre);
        this.pronosticoSeleccionado = null;
      }
    });
}
  

}

  
