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
  id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  project_id: string;

  @ManyToOne(() => User, (user) => user.user_id)
  @JoinColumn({ name: 'user_id' })
  users: User;

  @ManyToOne(() => Project, (project) => project.project_id)
  @JoinColumn({ name: 'project_id' })
  projects: Project;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
