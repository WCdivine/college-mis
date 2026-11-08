use sqlx::sqlite::{SqliteConnectOptions, SqlitePool, SqlitePoolOptions};

pub mod migrations;
pub mod seed;

pub type DbPool = SqlitePool;

pub async fn create_pool(opts: SqliteConnectOptions) -> Result<DbPool, sqlx::Error> {
    SqlitePoolOptions::new()
        .max_connections(5)
        .min_connections(1)
        .connect_with(opts)
        .await
}

pub async fn run_migrations(pool: &DbPool) -> Result<(), sqlx::Error> {
    migrations::run_migrations(pool).await
}
