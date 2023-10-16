import { Migration } from '@mikro-orm/migrations';

export class Migration20231016070843 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "products" ("id" varchar(255) not null, "title" varchar(255) not null, "description" varchar(255) not null, "price" int not null, constraint "products_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "products" cascade;');
  }

}
