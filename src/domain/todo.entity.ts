import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

@Entity('todo')
export class Todo extends BaseEntity {
    @Column({ name: 'name' })
    name: string;

    @Column({ type: 'boolean', name: 'completed' })
    completed: boolean;

    @Column({ type: 'datetime', name: 'completed_at', nullable: true })
    completedAt: any;
}
