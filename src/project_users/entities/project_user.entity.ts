import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Entity({ name: 't_project_users' })
export class ProjectUser {
  @PrimaryGeneratedColumn('increment')
  id: number; // Changed type from string to number

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  users: User;

  @ManyToOne(() => Project, (project) => project.project_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  projects: Project;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
