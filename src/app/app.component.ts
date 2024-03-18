import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Condicion actual', url: '/folder/condicion', icon: 'sunny' },
    { title: "Ciudades", url: '/folder/ciudades', icon: 'location' },
  ];
  public labels = [
    { title: 'DGAC', image: 'assets/DGAC.png' },
    { title: 'DMC', image: 'assets/DMC.png' },

  ]; 

  constructor() {

  }




}
