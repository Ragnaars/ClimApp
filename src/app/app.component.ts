import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Condicion actual', url: '/folder/condicion', icon: 'sunny' }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

   // Variable para almacenar las coordenadas 

  constructor() {
    
  }

  

 
}
