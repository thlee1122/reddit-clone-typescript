import { ObjectType, Field } from "type-graphql";
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany
} from 'typeorm';
import { Post } from "./Post";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  // ** Deleting @Field() so that this password will not be displayed
  // ** in the graphql query results
  // @Field()
  @Column()
  password!: string;

  @OneToMany(() => Post, post => post.creator)
  posts: Post[]

  @OneToMany(() => Updoot, updoot => updoot.user)
  updoots: Updoot[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  // updatedAt = new Date();
  updatedAt: Date;
}