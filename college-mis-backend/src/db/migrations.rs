use sqlx::SqlitePool;

pub async fn run_migrations(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    // 创建用户表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
    .execute(pool)
    .await?;

    // 创建学生表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL,
            student_id TEXT NOT NULL UNIQUE,
            department TEXT NOT NULL,
            major TEXT NOT NULL,
            enrollment_year INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        "#,
    )
    .execute(pool)
    .await?;

    // 创建教师表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS teachers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL,
            employee_id TEXT NOT NULL UNIQUE,
            department TEXT NOT NULL,
            title TEXT NOT NULL,
            hire_date TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        "#,
    )
    .execute(pool)
    .await?;

    // 创建获奖表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS awards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner_id INTEGER NOT NULL,
            owner_type TEXT NOT NULL,
            title TEXT NOT NULL,
            level TEXT NOT NULL,
            date TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
    .execute(pool)
    .await?;

    // 创建论文表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS papers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner_id INTEGER NOT NULL,
            owner_type TEXT NOT NULL,
            title TEXT NOT NULL,
            journal TEXT,
            publish_date TEXT NOT NULL,
            authors TEXT NOT NULL,
            doi TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
    .execute(pool)
    .await?;

    Ok(())
}
