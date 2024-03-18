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
    { title: "Ciudad", url: '/folder/ciudad', icon: 'compass' }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  // Variable para almacenar las coordenadas 

  constructor() {

  }




}
