CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "contributions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"prefecture" text NOT NULL,
	"location" text NOT NULL,
	"latitude" text,
	"longitude" text,
	"photo_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "haiku_monuments" (
	"id" integer PRIMARY KEY NOT NULL,
	"inscription" text NOT NULL,
	"commentary" text,
	"kigo" text,
	"season" text,
	"is_reliable" boolean DEFAULT false,
	"has_reverse_inscription" boolean DEFAULT false,
	"material" text,
	"total_height" numeric(8, 2),
	"width" numeric(8, 2),
	"depth" numeric(8, 2),
	"established_date" text,
	"established_year" text,
	"founder" text,
	"monument_type" text,
	"designation_status" text,
	"photo_url" text,
	"photo_date" text,
	"photographer" text,
	"model_3d_url" text,
	"remarks" text,
	"poet_id" integer,
	"source_id" integer,
	"location_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" integer PRIMARY KEY NOT NULL,
	"region" text NOT NULL,
	"prefecture" text NOT NULL,
	"municipality" text,
	"address" text,
	"place_name" text,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8)
);
--> statement-breakpoint
CREATE TABLE "poets" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"biography" text,
	"link_url" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"publisher" text,
	"source_year" integer,
	"url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_favorites" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"monument_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_favorites_user_id_monument_id_unique" UNIQUE("user_id","monument_id")
);
--> statement-breakpoint
CREATE TABLE "user_visits" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"monument_id" integer NOT NULL,
	"visited_at" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	"rating" integer,
	"visit_photo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_visits_user_id_monument_id_unique" UNIQUE("user_id","monument_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	"bio" text,
	"emailNotifications" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_monument_id_haiku_monuments_id_fk" FOREIGN KEY ("monument_id") REFERENCES "public"."haiku_monuments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_visits" ADD CONSTRAINT "user_visits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_visits" ADD CONSTRAINT "user_visits_monument_id_haiku_monuments_id_fk" FOREIGN KEY ("monument_id") REFERENCES "public"."haiku_monuments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_haiku_monuments_poet" ON "haiku_monuments" USING btree ("poet_id");--> statement-breakpoint
CREATE INDEX "idx_haiku_monuments_location" ON "haiku_monuments" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "idx_haiku_monuments_source" ON "haiku_monuments" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "idx_user_favorites_user_id" ON "user_favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_favorites_monument_id" ON "user_favorites" USING btree ("monument_id");--> statement-breakpoint
CREATE INDEX "idx_user_visits_user_id" ON "user_visits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_visits_monument_id" ON "user_visits" USING btree ("monument_id");--> statement-breakpoint
CREATE INDEX "idx_user_visits_visited_at" ON "user_visits" USING btree ("visited_at");