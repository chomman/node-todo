import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { ormConfig } from './orm.config';
import { TodoModule } from './module/todo.module';

@Module({
    imports: [TypeOrmModule.forRootAsync({ useFactory: ormConfig }), AuthModule, TodoModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
