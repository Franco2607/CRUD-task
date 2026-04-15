import { Component } from '@angular/core';
// 1. Importamos tu componente de tareas. 
import { TasksComponent } from './components/tasks/tasks.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. IMPORTANTE: Agregamos TasksComponent a los imports
  imports: [TasksComponent], 
  templateUrl: './app.html', // Apuntamos a tu archivo HTML real
  styleUrl: './app.css'      // Apuntamos a tu archivo CSS real 
})
export class App {
  title = 'frontend';
}