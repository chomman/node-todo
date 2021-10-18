import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from '../web/rest/todo.controller';
import { TodoRepository } from '../repository/todo.repository';
import { TodoService } from '../service/todo.service';

@Module({
    imports: [TypeOrmModule.forFeature([TodoRepository])],
    controllers: [TodoController],
    providers: [TodoService],
    exports: [TodoService],
})
export class TodoModule {}
