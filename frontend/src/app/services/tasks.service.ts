import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Definimos la interfaz (El "contrato" de cómo luce una tarea en tu NestJS)
export interface Task {
  id: number;
  title: string;
  description: string;
  iscompleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  // La URL exacta de tu backend NestJS
  private apiUrl = 'http://localhost:3000/tasks';

  // Inyectamos el HttpClient que configuraste en app.config.ts
  constructor(private http: HttpClient) {}

  // GET: Obtener todas las tareas
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // POST: Crear una tarea nueva
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // DELETE: Eliminar tarea por ID
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // PATCH: Actualizar tarea
  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, task);
  }
}