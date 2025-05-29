import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { AdapterAccountType } from 'next-auth/adapters';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    '環境変数が設定されていません。DATABASE_URLを設定してください。'
  );
}

const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: text('role').notNull().default('user'),
  bio: text('bio'),
  emailNotifications: boolean('emailNotifications').notNull().default(true),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

export const contributions = pgTable('contributions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  prefecture: text('prefecture').notNull(),
  location: text('location').notNull(),
  latitude: text('latitude'),
  longitude: text('longitude'),
  photo_url: text('photo_url'),
  status: text('status').notNull().default('pending'),
  created_at: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const poets = pgTable('poets', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  biography: text('biography'),
  linkUrl: text('link_url'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const sources = pgTable('sources', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author'),
  publisher: text('publisher'),
  sourceYear: integer('source_year'),
  url: text('url'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const locations = pgTable('locations', {
  id: integer('id').primaryKey(),
  region: text('region').notNull(),
  prefecture: text('prefecture').notNull(),
  municipality: text('municipality'),
  address: text('address'),
  placeName: text('place_name'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
});

export const haikuMonuments = pgTable('haiku_monuments', {
  id: integer('id').primaryKey(),
  inscription: text('inscription').notNull(), // 俳句本文
  commentary: text('commentary'), // 解説
  kigo: text('kigo'), // 季語
  season: text('season'), // 季節
  isReliable: boolean('is_reliable').default(false), // 信頼性
  hasReverseInscription: boolean('has_reverse_inscription').default(false), // 裏面刻字
  material: text('material'), // 材質
  totalHeight: decimal('total_height', { precision: 8, scale: 2 }), // 総高
  width: decimal('width', { precision: 8, scale: 2 }), // 幅
  depth: decimal('depth', { precision: 8, scale: 2 }), // 奥行
  establishedDate: text('established_date'), // 建立日
  establishedYear: text('established_year'), // 建立年
  founder: text('founder'), // 建立者
  monumentType: text('monument_type'), // 碑種
  designationStatus: text('designation_status'), // 指定状況
  photoUrl: text('photo_url'), // 写真URL
  photoDate: text('photo_date'), // 撮影日
  photographer: text('photographer'), // 撮影者
  model3dUrl: text('model_3d_url'), // 3Dモデル
  remarks: text('remarks'), // 備考
  
  // Foreign keys
  poetId: integer('poet_id'), // 俳人ID
  sourceId: integer('source_id'), // 出典ID  
  locationId: integer('location_id'), // 場所ID
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  index('idx_haiku_monuments_poet').on(table.poetId),
  index('idx_haiku_monuments_location').on(table.locationId),
  index('idx_haiku_monuments_source').on(table.sourceId),
]);

export const userFavorites = pgTable('user_favorites', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  monumentId: integer('monument_id')
    .notNull()
    .references(() => haikuMonuments.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  unique().on(table.userId, table.monumentId),
  index('idx_user_favorites_user_id').on(table.userId),
  index('idx_user_favorites_monument_id').on(table.monumentId),
]);

export const userVisits = pgTable('user_visits', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  monumentId: integer('monument_id')
    .notNull()
    .references(() => haikuMonuments.id, { onDelete: 'cascade' }),
  visitedAt: timestamp('visited_at', { mode: 'date' }).defaultNow().notNull(),
  notes: text('notes'),
  rating: integer('rating'),
  visitPhotoUrl: text('visit_photo_url'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  unique().on(table.userId, table.monumentId),
  index('idx_user_visits_user_id').on(table.userId),
  index('idx_user_visits_monument_id').on(table.monumentId),
  index('idx_user_visits_visited_at').on(table.visitedAt),
]);
