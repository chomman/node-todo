import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { TodoDTO } from '../../service/dto/todo.dto';
import { TodoService } from '../../service/todo.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('todos')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('todos')
export class TodoController {
    logger = new Logger('TodoController');

    constructor(private readonly todoService: TodoService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: TodoDTO,
    })
    async getAll(@Req() req: Request): Promise<TodoDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.todoService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: TodoDTO,
    })
    async getOne(@Param('id') id: number): Promise<TodoDTO> {
        return await this.todoService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create todo' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: TodoDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() todoDTO: TodoDTO): Promise<TodoDTO> {
        const created = await this.todoService.save(todoDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Todo', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update todo' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TodoDTO,
    })
    async put(@Req() req: Request, @Body() todoDTO: TodoDTO): Promise<TodoDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Todo', todoDTO.id);
        return await this.todoService.update(todoDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update todo with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TodoDTO,
    })
    async putId(@Req() req: Request, @Body() todoDTO: TodoDTO): Promise<TodoDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Todo', todoDTO.id);
        return await this.todoService.update(todoDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete todo' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Todo', id);
        return await this.todoService.deleteById(id);
    }
}
