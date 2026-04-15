/* aca va la logica en typescript del componente tasks */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Vital para que funcionen los inputs del formulario
import { TasksService, Task } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true, // Angular moderno usa componentes "standalone"
  imports: [CommonModule, FormsModule], // Importamos los módulos que usaremos en el HTML
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  // Aquí guardaremos la lista de tareas que el 'HttpClient' traiga del backend
  tasks: Task[] = [];
  newTaskTitle: string = '';
  newTaskDescription: string = '';

  editingTaskId: number | null = null;
  editingTaskTitle: string = '';
  editingTaskDescription: string = '';
  
  constructor(private tasksService: TasksService) {}

  // Este método se ejecuta automáticamente apenas la pantalla carga
  ngOnInit(): void {
    this.loadTasks(); 
  }

  // Método para pedir las tareas
  loadTasks(): void {
    // Llamamos al servicio y nos "suscribimos" (esperamos la respuesta)
    this.tasksService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data; // Si todo sale bien, guardamos las tareas
      },
      error: (err) => {
        console.error('Hubo un error al pedir las tareas:', err);
      }
    });
  }

  // Método para crear una tarea
  addTask(): void {
    // Si el título está vacío, no hacemos nada
    if (!this.newTaskTitle) return; 

    // Armamos el objeto con los datos que escribió el usuario
    const newTask = {
      title: this.newTaskTitle,
      description: this.newTaskDescription
    };

    // Usamos el servicio para enviarlo al backend
    this.tasksService.createTask(newTask).subscribe({
      next: (createdTask) => {
        // Si NestJS lo guardó bien, lo agregamos a nuestra lista visual sin recargar la página
        this.tasks.push(createdTask);
        
        // Limpiamos las cajas de texto
        this.newTaskTitle = '';
        this.newTaskDescription = '';
      },
      error: (err) => console.error('Error al crear tarea:', err)
    });
  }

  // Método para eliminar
  deleteTask(id: number): void {
    this.tasksService.deleteTask(id).subscribe({
      next: () => {
        // Sacamos de nuestra lista visual la tarea que acabamos de borrar en el backend
        this.tasks = this.tasks.filter(task => task.id !== id);
      },
      error: (err) => console.error('Error al eliminar tarea:', err)
    });
  }

  // CHECKBOX: Marcar tarea como completada
  toggleCompletion(task:Task): void {
    //actualizar a true o false
    const updatedata = { iscompleted: !task.iscompleted};

    this.tasksService.updateTask(task.id, updatedata).subscribe({
      next:(updatetask) => {
        //actualizar la parte visual
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatetask
        }
      },
      error: (err) => console.error ('Error al actualizar el estado: ', err) 
    })
  }

  //Activar el "El modo edicion"
  startEdit(task: Task): void {
    this.editingTaskId = task.id
    this.editingTaskTitle = task.title
    this.editingTaskDescription= task.description
  }

  //Cancelar edicion
  cancelEdit(): void {
    this.editingTaskId = null;
  }

  //Guardar los cambios del texto
  saveEdit(task:Task): void {
    const updatedata = {
      title: this.editingTaskTitle,
      description : this.editingTaskDescription
    };
    this.tasksService.updateTask(task.id, updatedata).subscribe({
      next: (updateTask) => {
        //Actualizamos visualmente
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updateTask
        }
        //Salimos del modo edicion
        this.editingTaskId = null;
      },
      error: (err) => console.error('Error al editar el texto: ', err)
    })
  }
}