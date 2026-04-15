import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  // Inyectamos el "Gerente" de la tabla tareas (Repository)
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // .create() solo prepara el objeto, .save() es el que viaja a la nube y lo guarda
    const newTask = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(newTask);
  }

  async findAll(): Promise<Task[]> {
    // .find() trae todo. Le ponemos un 'order' para que siempre salgan ordenadas por ID
    return await this.taskRepository.find({
      order: { id: 'ASC' } 
    });
  }

  async findOne(id: number): Promise<Task> {
    // Buscamos por ID
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`La tarea con el ID ${id} no existe`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // .preload() es un truco genial de NestJS. Busca por ID y reemplaza 
    // solo los datos que vengan en el DTO, armando la tarea actualizada lista para guardar.
    const task = await this.taskRepository.preload({
      id: id,
      ...updateTaskDto,
    });

    if (!task) {
      throw new NotFoundException(`La tarea con el ID ${id} no existe para actualizar`);
    }

    // Guardamos los cambios en la nube
    return await this.taskRepository.save(task);
  }

  async remove(id: number): Promise<{ message: string }> {
    // Primero verificamos que exista usando nuestro propio método findOne
    const task = await this.findOne(id);
    
    // Si existe, la eliminamos de la base de datos
    await this.taskRepository.remove(task);
    
    return { message: 'Task deleted successfully' };
  }
}