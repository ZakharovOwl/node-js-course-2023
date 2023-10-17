import { Migration } from '@mikro-orm/migrations';

export class Migration20231017053900 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "products" ("id" varchar(255) not null, "title" varchar(255) not null, "description" varchar(255) not null, "price" int not null, constraint "products_pkey" primary key ("id"));');

    this.addSql('create table "users" ("id" varchar(255) not null, "username" varchar(255) not null, "email" varchar(255) not null, "cart_id" varchar(255) null, constraint "users_pkey" primary key ("id"));');
    this.addSql('alter table "users" add constraint "users_cart_id_unique" unique ("cart_id");');

    this.addSql('create table "orders" ("id" varchar(255) not null, "user_id" varchar(255) not null, "cart_id" varchar(255) not null, "items" jsonb not null, "payment" jsonb not null, "delivery" jsonb not null, "comments" varchar(255) null, "status" varchar(255) not null, "total_price" int not null, constraint "orders_pkey" primary key ("id"));');

    this.addSql('create table "carts" ("id" varchar(255) not null, "is_deleted" boolean not null default false, "items" jsonb not null, "user_id" varchar(255) not null, constraint "carts_pkey" primary key ("id"));');

    this.addSql('alter table "users" add constraint "users_cart_id_foreign" foreign key ("cart_id") references "carts" ("id") on update cascade on delete set null;');

    this.addSql('alter table "orders" add constraint "orders_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');

    this.addSql('alter table "carts" add constraint "carts_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "orders" drop constraint "orders_user_id_foreign";');

    this.addSql('alter table "carts" drop constraint "carts_user_id_foreign";');

    this.addSql('alter table "users" drop constraint "users_cart_id_foreign";');

    this.addSql('drop table if exists "products" cascade;');

    this.addSql('drop table if exists "users" cascade;');

    this.addSql('drop table if exists "orders" cascade;');

    this.addSql('drop table if exists "carts" cascade;');
  }

}
