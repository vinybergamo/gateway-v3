import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { BaseSchema } from 'src/database/base-schema';
import { Exclude } from 'class-transformer';
import { hashSync, compareSync, genSaltSync } from 'bcrypt';
import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import phone from 'phone';

@ApiSchema({
  name: 'UserEntity',
})
@Entity()
export class User extends BaseSchema {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john_doe@email.comm',
  })
  @Column()
  email: string;

  @ApiProperty({
    description: 'Document of the user',
    example: '12345678909',
  })
  @Column({ unique: true })
  document: string;

  @ApiProperty({
    description: 'Type of the document',
    example: 'BR:CPF',
  })
  @Column({ default: 'BR:CPF' })
  documentType: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+5511999999999',
  })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    description: 'Country code for the phone number',
    example: 'BR:+55',
  })
  @Column({ nullable: true })
  phoneCountry: string;

  @Exclude()
  @Column()
  @ApiHideProperty()
  password: string;

  @ApiProperty({
    description: 'Avatar of the user',
    example: 'https://example.com/avatar.jpg',
  })
  @Column({ nullable: true })
  avatar: string;

  hashPassword() {
    const salt = genSaltSync(10);
    const hash = hashSync(this.password, salt);
    this.password = hash;
  }

  passwordMatch(password: string): boolean {
    return compareSync(password, this.password);
  }

  getPhoneCoutryCode() {
    const { isValid, countryCode, countryIso2 } = phone(`${this.phone}`);

    if (!isValid) {
      this.phone = null;
      this.phoneCountry = null;
      return null;
    }

    this.phoneCountry = `${countryIso2}:${countryCode}`;

    return this.phoneCountry;
  }

  @BeforeInsert()
  beforeInsertActions() {
    this.hashPassword();
    this.getPhoneCoutryCode();
  }

  @BeforeUpdate()
  beforeUpdateActions() {
    this.getPhoneCoutryCode();
  }
}
