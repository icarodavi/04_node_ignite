import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository.createQueryBuilder('games')
    // .select('*').from(Game, 'game')
    .where(`games.title ILIKE '%${param}%'`)
    .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query(`SELECT COUNT(games.id) from games`);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository.createQueryBuilder('games')
    .innerJoinAndSelect('games.users', 'users')
    .where('games.id = :id', { id: id }).getOneOrFail();
  
    return game.users;
    
  }
}
