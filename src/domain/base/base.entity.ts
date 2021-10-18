import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ nullable: true })
    createdBy?: string;
    @CreateDateColumn({ nullable: true })
    createdAt?: Date;
    @Column({ nullable: true })
    updatedBy?: string;
    @UpdateDateColumn({ nullable: true })
    updatedAt?: Date;
}
