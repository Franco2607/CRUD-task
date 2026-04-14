import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private idCounter = 1;


  create(createTaskDto: CreateTaskDto) {
    const newTask: Task = {
      id: this.idCounter++,
      title: createTaskDto.title,
      description: createTaskDto.description,
      iscompleted: false,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  findAll() {
    return this.tasks;
  }

  findOne(id: number) {
    return this.tasks.find(task => task.id === id);
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const updatedtask = this.tasks.find(task => task.id === id);
    if (!updatedtask) throw new NotFoundException('Task not found');
    
    if (updateTaskDto.title !== undefined) {
      updatedtask.title = updateTaskDto.title;
    }

    if (updateTaskDto.description !== undefined) {
      updatedtask.description = updateTaskDto.description;
    }

    if (updateTaskDto.iscompleted !== undefined) {
      updatedtask.iscompleted = updateTaskDto.iscompleted;
    }

    return updatedtask;
  }

  remove(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    return { message: 'Task deleted successfully' };
  }
}
