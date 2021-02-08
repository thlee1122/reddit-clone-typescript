import 'reflect-metadata';
import { COOKIE_NAME, __prod__ } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { User } from './entities/User';
import { Post } from './entities/Post';
import path from 'path';
import { Updoot } from './entities/Updoot';

declare module "express-session" {
  interface Session {
    userId: number;
  }
}

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'lireddit2',
    username: 'postgres',
    password: 'postgres',
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname,  "./migrations/*")], 
    entities: [Post, User, Updoot]
  });

  await conn.runMigrations();

  // await Post.delete({});

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: 'http://localhost:3000', 
      credentials: true
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ 
        client: redis,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // protetcing csrt
        secure: __prod__ // cookie only works in https
      },
      saveUninitialized: false, 
      secret: "dwdwdwdwdw",
      resave: false
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),

    //Passing orm.em, which is the database that has all the data as the context
    //so that orm.em will be available in all resolvers.
    context: ({ req, res }) => ({ req, res, redis })
  });

  apolloServer.applyMiddleware({ app, cors: false }); 


  app.listen(4000, () => {
    console.log('Server started on localhost:4000')
  })
}

main();
