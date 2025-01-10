import dotenv from "dotenv";
dotenv.config();

const DEFAULT_PG_URL: string =
  "postgres://postgres:root@postgres:5432/postgres";
const DEFAULT_SERVER_PORT: number = 5000;
const DEFAULT_CLIENT_URL: string = "localhost";
const DEFAULT_JWT_ACCESS_SECRET: string = "someSecretKey33485";
const DEFAULT_JWT_REFRESH_SECRET: string = "someSecretKey33486";
const DEFAULT_REDIS_HOST: string = "redis";
const DEFAULT_REDIS_PORT: string = "6379";
const DEFAULT_REDIS_PASSWORD: string = "";
const DEFAULT_EXPIRY_TIME: number = 5 * 60;
const DEFAULT_FROM: string = "ALLIN";

const AWS_BUCKET_NAME: string = process.env.AWS_BUCKET_NAME as string;
const AWS_BUCKET_NAME_PUBLIC: string = process.env
    .AWS_BUCKET_NAME_PUBLIC as string;
const AWS_BUCKET_REGION: string = process.env.AWS_BUCKET_REGION as string;
const AWS_ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID as string;
const AWS_ACCESS_KEY_SECRET: string = process.env
    .AWS_ACCESS_KEY_SECRET as string;
const AWS_ENDPOINT: string = process.env.AWS_ENDPOINT as string;

export const PG_URL: string = process.env.PG_URL || DEFAULT_PG_URL;
export const SERVER_PORT: number = +(
  process.env.SERVER_PORT || DEFAULT_SERVER_PORT
);
export const JWT_ACCESS_SECRET: string =
  process.env.JWT_ACCESS_SECRET || DEFAULT_JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET: string =
  process.env.JWT_REFRESH_SECRET || DEFAULT_JWT_REFRESH_SECRET;
export const CLIENT_URL: string = process.env.CLIENT_URL || DEFAULT_CLIENT_URL;
export const BOT_TOKEN: string = process.env.BOT_TOKEN as string;
export const CHAT_ID: string = process.env.CHAT_ID as string;
export const LOGS_CHAT_ID: string = process.env.LOGS_CHAT_ID as string;
export const EXPIRY_TIME: number = +(
  process.env.EXPIRY_TIME || DEFAULT_EXPIRY_TIME
);

export const NODE_ENV: string = process.env.NODE_ENV || "development";
const REDIS_HOST: string = process.env.REDIS_HOST || DEFAULT_REDIS_HOST;
const REDIS_PORT: string = process.env.REDIS_PORT || DEFAULT_REDIS_PORT;
const REDIS_PASSWORD: string =
  process.env.REDIS_PASSWORD || DEFAULT_REDIS_PASSWORD;

const MOBIZON_URL: string = process.env.MOBIZON_URL as string;
const MOBIZON_API_KEY: string = process.env.MOBIZON_API_KEY as string;
const MOBIZON_FROM: string = process.env.MOBIZON_FROM || DEFAULT_FROM;

const FIREBASE_TYPE: string = process.env.FCM_ID as string;
const FIREBASE_PROJECT_ID: string = process.env.FIREBASE_PROJECT_ID as string;
const FIREBASE_PRIVATE_KEY_ID: string = process.env.FIREBASE_PRIVATE_KEY_ID as string;
const FIREBASE_PRIVATE_KEY: string = process.env.FIREBASE_PRIVATE_KEY as string;
const FIREBASE_CLIENT_EMAIL: string = process.env.FIREBASE_CLIENT_EMAIL as string;
const FIREBASE_CLIENT_ID: string = process.env.FIREBASE_CLIENT_ID as string;
const FIREBASE_AUTH_URI: string = process.env.FIREBASE_AUTH_URI as string;
const FIREBASE_TOKEN_URI: string = process.env.FIREBASE_TOKEN_URI as string;
const FIREBASE_AUTH_PROVIDER_CERT_URL: string = process.env.FIREBASE_AUTH_PROVIDER_CERT_URL as string;
const FIREBASE_CLIENT_CERT_URL: string = process.env.FIREBASE_CLIENT_CERT_URL as string;
const FIREBASE_UNIVERSE_DOMAIN: string = process.env.FIREBASE_UNIVERSE_DOMAIN as string;
const FIREBASE_HOST: string = process.env.FIREBASE_HOST as string;
const FIREBASE_MESSAGING_SCOPE: string = process.env.FIREBASE_MESSAGING_SCOPE as string;


export const FIREBASE = {
  type: FIREBASE_TYPE,
  projectId: FIREBASE_PROJECT_ID,
  privateKeyId: FIREBASE_PRIVATE_KEY_ID,
  privateKey: FIREBASE_PRIVATE_KEY,
  clientEmail: FIREBASE_CLIENT_EMAIL,
  clientId: FIREBASE_CLIENT_ID,
  authUri: FIREBASE_AUTH_URI,
  tokenUri: FIREBASE_TOKEN_URI,
  authProviderCertUrl: FIREBASE_AUTH_PROVIDER_CERT_URL,
  clientCertUrl: FIREBASE_CLIENT_CERT_URL,
  universeDomain: FIREBASE_UNIVERSE_DOMAIN,
  host: FIREBASE_HOST,
  messagingScope: FIREBASE_MESSAGING_SCOPE,

};

export const REDIS = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
};

export const SMS = {
  url: MOBIZON_URL,
  apiKey: MOBIZON_API_KEY,
  from: MOBIZON_FROM,
};

export const AWS = {
  region: AWS_BUCKET_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_ACCESS_KEY_SECRET,
  bucketName: AWS_BUCKET_NAME,
  bucketNamePublic: AWS_BUCKET_NAME_PUBLIC,
  endpoint: AWS_ENDPOINT,
};

export const IMAGEMIMETYPES = ["image/jpeg", "image/png", "image/jpg"];
