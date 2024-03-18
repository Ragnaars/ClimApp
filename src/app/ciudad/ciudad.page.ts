// Importaciones necesarias
import { ActivatedRoute } from '@angular/router';
import { ObtenerLocalidaqdService } from "../services/obtenerLocalidad/obtener-localidaqd.service";
import { Component, OnInit } from '@angular/core'; 

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.page.html',
  styleUrls: ['./ciudad.page.scss']
})
export class CiudadPage implements OnInit {
  codigoCiudad: any; // Variable para almacenar el código de la ciudad
  datosPronosLocalidad: any; // Variable para almacenar los datos del pronóstico de la localidad
  nombreLocalidad: any; // Variable para almacenar el nombre de la localidad
  objetoCondicion: any; // Variable para almacenar el objeto de condición actual del pronóstico
  condicionTexto: any; // Variable para almacenar el texto de la condición actual del pronóstico
  pronosticos: any; // Variable para almacenar los pronósticos de la localidad

  constructor(
    private route: ActivatedRoute, // Inyección del servicio ActivatedRoute para obtener parámetros de la URL
    private pronosticoLocalidad: ObtenerLocalidaqdService // Inyección del servicio para obtener el pronóstico de la localidad
  ) { }

  ngOnInit() {
    // Suscripción a cambios en los parámetros de la URL
    this.route.params.subscribe(params => {
      // Recibe el código de la ciudad de los parámetros de la URL
      this.codigoCiudad = params['codigo'];
      console.log(this.codigoCiudad);
      // Llama a la función para obtener los datos del pronóstico al recibir el código de la ciudad
      this.obtenerDatosPronostico(); 
    });
  }

  // Función para obtener los datos del pronóstico de la localidad
  obtenerDatosPronostico() {
    this.pronosticoLocalidad.obtenerLocalidadCompleta(this.codigoCiudad)
      .subscribe((localidad) => { // Suscripción al observable que devuelve los datos del pronóstico
        // Almacena los datos del pronóstico de la localidad
        this.datosPronosLocalidad = localidad.data[0];
        // Almacena los pronósticos de la localidad
        this.pronosticos = this.datosPronosLocalidad.pronostico;
        // Almacena el nombre de la localidad
        this.nombreLocalidad = this.datosPronosLocalidad.nombre;
        // Almacena el objeto de condición actual del pronóstico
        this.objetoCondicion = this.datosPronosLocalidad.condicionActual;

        // Verifica si objetoCondicion no es null para acceder a sus propiedades
        if (this.objetoCondicion) {
          // Almacena el texto de la condición actual del pronóstico, convirtiéndolo a minúsculas y eliminando espacios
          this.condicionTexto = this.objetoCondicion.condicionTexto.toLowerCase().replace(/\s/g, '');
          console.log("objeto condicion", this.objetoCondicion);
          console.log("condicion texto", this.condicionTexto);
        } else {
          console.log("El objeto condición es null.");
        }
        
        console.log("pronostico localidad", this.datosPronosLocalidad); // Imprime los datos del pronóstico de la localidad
        console.log("datos", localidad); // Imprime los datos completos devueltos por el servicio
      });
  }

  redondearTemperatura() {
    return Math.floor(this.objetoCondicion.temperatura);
  }

}
