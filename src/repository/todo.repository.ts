import { EntityRepository, Repository } from 'typeorm';
import { Todo } from '../domain/todo.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {}
