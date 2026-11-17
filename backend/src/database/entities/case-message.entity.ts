import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity as TypeOrmBaseEntity } from 'typeorm';
import { Case } from './case.entity';
import { User } from './user.entity';

@Entity('case_messages')
export class CaseMessage extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;

  @Column({ type: 'uuid', name: 'case_id' })
  caseId: string;

  @ManyToOne(() => Case, (c) => c.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'case_id' })
  case: Case;

  @Column({ type: 'uuid', name: 'sender_user_id' })
  senderUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_user_id' })
  sender: User;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false, name: 'is_internal_note' })
  isInternalNote: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
