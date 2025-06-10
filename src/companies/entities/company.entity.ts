import { Column, Entity } from 'typeorm';
import { BaseSchema } from '../../database/base-schema';

@Entity()
export class Company extends BaseSchema {
  @Column()
  mame: string;

  @Column({ nullable: true })
  fantasyName: string;

  @Column()
  document: string;

  @Column({ default: 'BR:CNPJ' })
  documentType: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  phoneCountry: string;

  @Column({ nullable: true, type: 'jsonb' })
  address: Record<string, any>;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  website: string;
}
