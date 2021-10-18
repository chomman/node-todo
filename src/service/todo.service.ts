import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { TodoDTO } from '../service/dto/todo.dto';
import { TodoMapper } from '../service/mapper/todo.mapper';
import { TodoRepository } from '../repository/todo.repository';

const relationshipNames = [];

@Injectable()
export class TodoService {
    logger = new Logger('TodoService');

    constructor(@InjectRepository(TodoRepository) private todoRepository: TodoRepository) {}

    async findById(id: number): Promise<TodoDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.todoRepository.findOne(id, options);
        return TodoMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<TodoDTO>): Promise<TodoDTO | undefined> {
        const result = await this.todoRepository.findOne(options);
        return TodoMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<TodoDTO>): Promise<[TodoDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.todoRepository.findAndCount(options);
        const todoDTO: TodoDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(todo => todoDTO.push(TodoMapper.fromEntityToDTO(todo)));
            resultList[0] = todoDTO;
        }
        return resultList;
    }

    async save(todoDTO: TodoDTO, creator?: string): Promise<TodoDTO | undefined> {
        const entity = TodoMapper.fromDTOtoEntity(todoDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.updatedBy = creator;
        }
        const result = await this.todoRepository.save(entity);
        return TodoMapper.fromEntityToDTO(result);
    }

    async update(todoDTO: TodoDTO, updater?: string): Promise<TodoDTO | undefined> {
        const entity = TodoMapper.fromDTOtoEntity(todoDTO);
        if (updater) {
            entity.updatedBy = updater;
        }
        const result = await this.todoRepository.save(entity);
        return TodoMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.todoRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, Todo not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
