import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234', // IMPORTANTE: Coloque sua senha do MySQL aqui
  database: 'tasks',

  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
});