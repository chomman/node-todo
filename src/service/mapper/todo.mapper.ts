import { Todo } from '../../domain/todo.entity';
import { TodoDTO } from '../dto/todo.dto';

export class TodoMapper {
    static fromDTOtoEntity(entityDTO: TodoDTO): Todo {
        if (!entityDTO) {
            return;
        }
        const entity = new Todo();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Todo): TodoDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new TodoDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
