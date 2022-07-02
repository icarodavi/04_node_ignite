import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.query(
      `SELECT "users"."id" AS "users_id", 
      "users"."first_name" AS "users_first_name", 
      "users"."last_name" AS "users_last_name", 
      "users"."email" AS "users_email", 
      "users"."created_at" AS "users_created_at", 
      "users"."updated_at" AS "users_updated_at", 
      "games"."id" AS "games_id", 
      "games"."title" AS "games_title", 
      "games"."created_at" AS "games_created_at", 
      "games"."updated_at" AS "games_updated_at" FROM "users" "users" 
      INNER JOIN "users_games_games" "users_games" ON "users_games"."usersId"="users"."id" 
      INNER JOIN "games" "games" ON "games"."id"="users_games"."gamesId" 
      WHERE "users"."id" = "${user_id}"`);
  console.log(user);
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query(`SELECT  * from users ORDER BY users.first_name ASC`); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository
    .query(`SELECT * from users WHERE first_name 
    ILIKE '%${first_name}%'
    AND last_name ILIKE '%${last_name}%'`); // Complete usando raw query
  }
}
