import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from './user.entity';
import { Notification } from './notification.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isEdited: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  @Column({ nullable: true })
  parentId: string;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @OneToMany(() => Notification, (notification) => notification.comment)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Computed property to check if edit window is still open (15 minutes)
  @Expose()
  get canEdit(): boolean {
    const fifteenMinutes = 15 * 60 * 1000;
    // Always use UTC for both values
    const nowUTC = new Date().getTime(); 
    const createdUTC = this.createdAt.getTime(); 
    return nowUTC - createdUTC < fifteenMinutes;
  }

  // Computed property to check if delete is allowed (always allowed for owners)
  @Expose()
  get canDelete(): boolean {
    return true; 
  }

  // Computed property to check if restore window is still open (15 minutes after deletion)
  @Expose()
  get canRestore(): boolean {
    if (!this.isDeleted || !this.deletedAt) return false;
    const fifteenMinutes = 15 * 60 * 1000;
    const nowUTC = new Date().getTime();
    const deletedUTC = this.deletedAt.getTime();
    return nowUTC - deletedUTC < fifteenMinutes;
  }
}
