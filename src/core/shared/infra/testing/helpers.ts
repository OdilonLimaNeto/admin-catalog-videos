import { Sequelize, type SequelizeOptions } from 'sequelize-typescript';
import { Configuration } from '../configuration';

export function setupSequelize(options: SequelizeOptions = {}) {
  let _sequelize: Sequelize;

  beforeAll(async () => {
    _sequelize = new Sequelize({
      ...Configuration.database(),
      ...options,
    });
  });

  beforeEach(async () => {
    await _sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await _sequelize.close();
  });

  return {
    get sequelize() {
      return _sequelize;
    },
  };
}
