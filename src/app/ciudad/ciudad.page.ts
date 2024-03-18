
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
  codigoCiudad: any;
  datosPronosLocalidad: any;
  nombreLocalidad: any;
  objetoCondicion: any;
  condicionTexto: any
  pronosticos: any;

  constructor(
    private route: ActivatedRoute,
    private pronosticoLocalidad: ObtenerLocalidaqdService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.codigoCiudad = params['codigo']; // Recibe el código de la ciudad de los parámetros de la URL
      console.log(this.codigoCiudad);
      this.obtenerDatosPronostico(); // Llama a la función para obtener los datos del pronóstico al recibir el código de la ciudad
    });
  }

  obtenerDatosPronostico() {
    this.pronosticoLocalidad.obtenerLocalidadCompleta(this.codigoCiudad)
      .subscribe((localidad) => {
        this.datosPronosLocalidad = localidad.data[0];
        this.pronosticos = this.datosPronosLocalidad.pronostico;
        this.nombreLocalidad = this.datosPronosLocalidad.nombre;
        this.objetoCondicion = this.datosPronosLocalidad.condicionActual;

        if (this.objetoCondicion) { // Verifica si objetoCondicion no es null
          this.condicionTexto = this.objetoCondicion.condicionTexto.toLowerCase().replace(/\s/g, '');
          console.log("objeto condicion", this.objetoCondicion);
          console.log("condicion texto", this.condicionTexto);
        } else {
          console.log("El objeto condición es null.");
        }
        
        console.log("pronostico localidad", this.datosPronosLocalidad);
        console.log("datos", localidad);
      });
  }

}
