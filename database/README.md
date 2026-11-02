# Database consolidation

One unchanged copy of the common dump and Workbench model is kept here. No database was connected to, imported, reset, migrated, or modified during integration.

## Verified comparison

Every one of the four original `midvejsprojekt_pokemon_data.sql` files has SHA-256:

```text
BC0DF594E19BC056C8335573039319A71F0CD76EBE2D4A47FDE1C766C83527BE
```

Every one of the four original `midvejsprojekt_pokemon_database.mwb` files has SHA-256:

```text
260CFB6077CF0D1A8257FACB7BE05A99C97C93E501EF97C9D0230C1D142D6D82
```

The Workbench ZIP/XML was opened for inspection. Its populated model is `midvejsprojekt_pokemon`; an additional empty `mydb` schema shell is present. All seven table names and their ordered column-name lists match the SQL dump. Exact equality across the four source versions establishes there are no project-specific schema changes to merge. This does not establish that an independently running MySQL database has the same schema.

## Tables and relationships

| Table | Key | Relationships / use |
| --- | --- | --- |
| `body_shape` | `body_shape_id` | Referenced by `pokemon.body_shape_id` |
| `pokemon` | `pokedex_number` | Six stat columns; `primary_type`, `secondary_type`; Pokédex and Battle Lab |
| `moves` | `move_id` | Move catalogue; dashboard count; spelling `catagory` retained |
| `pokemon_moves` | `(pokedex_number, move_id)` | FKs to Pokémon and moves |
| `trainer` | `trainer_id` | `trainer_name`, `age`, `hometown` |
| `trainer_pokemon` | `(trainer_id, pokedex_number)` | FKs to trainer and Pokémon; existing collections and new captures |
| `gyms` | `gym_id` | Optional FK `trainer_id` to trainer |

Stat columns are `hp`, `attack`, `defence`, `special_attack`, `special_defence`, `speed`; the British spellings are preserved. Existing composite keys prevent duplicate trainer/species and Pokémon/move pairs. Source data contains 151 Pokémon, 12 trainers, 20 trainer/species relationships, and 165 moves. A live database may legitimately have different counts. The dump specifies MySQL 8 collation `utf8mb4_0900_ai_ci` and originates from MySQL 8.0.46.

## Existing database: no migration

1. Configure your own connection in the destination `.env`; the runtime retains original variable names `DBHOST`, `DBUSER`, `DBPASSWORD`, and `DBDATABASE`, and adds optional `DBPORT`.
2. Connect to the intended database in Workbench and, if needed, run `check-schema.sql`. It only reads metadata/counts. Confirm `SELECT DATABASE()` identifies the intended schema before interpreting results.
3. Start Express and visit `/api/health`, `/api/pokemon`, `/api/trainers`, and `/api/stats` through the local application URL.
4. Use SELECT permission on the four runtime tables. Use INSERT on `trainer_pokemon` only when capture functionality is enabled. `ENABLE_CATCHES=false` rejects all capture submissions without issuing an INSERT.

No DDL privilege is required by the app. No CREATE DATABASE, table creation, import, or migration runs when installing npm packages, running tests, or starting the server.

## Optional setup on a new empty database

The preserved dump includes `DROP TABLE IF EXISTS`, `LOCK TABLES`, disabled FK checks during import, and full INSERT data. It is unsuitable for applying over valuable existing data.

If a database does not exist, manually create a separate empty MySQL 8 schema in Workbench, select it as the default, review the preserved dump, then import it into that empty schema. The dump does not create/select the database itself. Import privileges differ from the limited runtime account's permissions. Check the seven tables and relationships after importing. Point `.env` at the new schema. These are optional manual actions; none was executed by the integration.
