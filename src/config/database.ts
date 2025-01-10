import { Sequelize } from "sequelize-typescript";

import { PG_URL, NODE_ENV } from "./settings";
import logger from "./logger";
import { User } from "../app/modules/user/user.entity";
import { Location } from "../app/modules/location/location.entity";
import { Token } from "../app/modules/auth/auth.entity";
import {Profile} from "../app/modules/profile/profile.entity";
import {Comment} from "../app/modules/comment/comment.entity";
import {Like} from "../app/modules/like/like.entity";
import {ChatType} from "../app/modules/chat-type/chat-type.entity";
import {Chat} from "../app/modules/chat/chat.entity";
import {SubChat} from "../app/modules/sub-chat/sub-chat.entity";
import {Category} from "../app/modules/category/category.entity";
import {MyChats} from "../app/modules/my-chat/my-chat.entity";
import {Message} from "../app/modules/message/message.entity";
import {Complaint} from "../app/modules/complaint/complaint.entity";
import {QueryTypes} from "sequelize";
import {History} from "../app/modules/history/history.entity";

const isDev = NODE_ENV === "development";

export interface CheckDBResult {
  result: number;
}

export class DB {
  private static sequelize: Sequelize;

  public static async initDB() {
    DB.sequelize = new Sequelize(PG_URL, {
      dialect: "postgres",
      host: "postgres",
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: false
    });

    DB.sequelize.addModels([User, Location, Token, Profile, Comment, Like, ChatType, Chat, SubChat, Category, MyChats, Message, Complaint, History]);

    try {
      await DB.sequelize.authenticate();
      await DB.sequelize.sync({ alter: isDev });
      logger.info(
        "Connection to the database has been established successfully."
      );
    } catch (e) {
      logger.error(`Unable to connect to the database: ${e}`);
      throw e;
    }
  }

  public static async CheckDBConnection(): Promise<CheckDBResult> {
    try {
      const result: CheckDBResult[] = await DB.sequelize.query('SELECT 1+1 as result', {
        type: QueryTypes.SELECT,
      });

      return result[0];
    } catch (error) {
      logger.error(`Error executing SELECT 1+1 query: ${error}`);
      throw error;
    }
  }

  public static async closeDB() {
    try {
      await DB.sequelize.close();
      logger.info("Connection to the database has been closed successfully.");
    } catch (e) {
      logger.error(`Unable to close the database connection: ${e}`);
      throw e;
    }
  }
}
