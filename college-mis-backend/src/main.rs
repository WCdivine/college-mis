use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer};
use rust_embed::RustEmbed;
use sqlx::sqlite::SqliteConnectOptions;
use std::env;
use std::str::FromStr;
use tracing_subscriber::{fmt, prelude::*, EnvFilter};

mod db;
mod handlers;
mod middleware;
mod models;

/// 前端静态资源：构建期嵌入 ../college-mis-frontend/dist 目录
#[derive(RustEmbed)]
#[folder = "../college-mis-frontend/dist"]
struct Assets;

async fn serve_frontend(tail: web::Path<String>) -> HttpResponse {
    let req_path = tail.into_inner();
    if !req_path.is_empty() {
        if let Some(file) = Assets::get(&req_path) {
            let mime = mime_guess::from_path(&req_path).first_or_octet_stream();
            return HttpResponse::Ok()
                .content_type(mime.to_string())
                .body(file.data);
        }
    }
    // 其余路径统一回退到 index.html（SPA 前端路由）
    match Assets::get("index.html") {
        Some(file) => HttpResponse::Ok()
            .content_type("text/html; charset=utf-8")
            .body(file.data),
        None => HttpResponse::NotFound().body("index.html not found"),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 初始化日志（默认 info 级别）
    tracing_subscriber::registry()
        .with(fmt::layer())
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")))
        .init();

    // 加载环境变量（可选，exe 单文件运行时无需 .env）
    dotenv::dotenv().ok();

    let port = env::var("PORT")
        .unwrap_or_else(|_| "8081".to_string())
        .parse::<u16>()
        .unwrap_or(8081);

    // 数据库默认放在 exe 同目录（首次运行自动创建）；可用 DATABASE_URL 覆盖
    let db_opts = match env::var("DATABASE_URL") {
        Ok(url) => SqliteConnectOptions::from_str(&url)
            .expect("invalid DATABASE_URL")
            .create_if_missing(true),
        Err(_) => {
            let db_path = env::current_exe()?
                .parent()
                .expect("exe has no parent dir")
                .join("college_mis.db");
            println!("数据库文件：{}", db_path.display());
            SqliteConnectOptions::new()
                .filename(&db_path)
                .create_if_missing(true)
        }
    };

    // 创建数据库连接池
    let pool = db::create_pool(db_opts)
        .await
        .expect("Failed to create database pool");

    // 运行数据库迁移
    db::run_migrations(&pool)
        .await
        .expect("Failed to run migrations");

    // 创建初始管理员账户
    create_initial_admin(&pool).await;

    // 写入演示数据（仅空库时）
    db::seed::seed_demo(&pool).await;

    let addr = ("127.0.0.1", port);

    // 启动成功后自动打开浏览器
    let url = format!("http://127.0.0.1:{}", port);
    let url_for_browser = url.clone();
    std::thread::spawn(move || {
        std::thread::sleep(std::time::Duration::from_millis(1000));
        let _ = std::process::Command::new("explorer").arg(&url_for_browser).spawn();
    });

    println!();
    println!("==============================================");
    println!("  学院信息管理系统 已启动");
    println!("  访问地址：{}", url);
    println!("  默认账号：admin / admin123");
    println!("  关闭本窗口即退出系统");
    println!("==============================================");
    println!();

    tracing::info!("Starting server at http://127.0.0.1:{}", port);

    // 启动 HTTP 服务器
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(actix_web::middleware::Logger::default())
            .app_data(web::Data::new(pool.clone()))
            .configure(configure_routes)
    })
    .bind(addr)?
    .run()
    .await
}

fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            // 认证路由
            .service(
                web::scope("/auth")
                    .route("/register", web::post().to(handlers::auth::register))
                    .route("/login", web::post().to(handlers::auth::login))
                    .route("/me", web::get().to(handlers::auth::get_current_user)),
            )
            // 学生管理路由
            .service(
                web::scope("/students")
                    .route("", web::get().to(handlers::students::get_students))
                    .route("", web::post().to(handlers::students::create_student))
                    .route("/{id}", web::get().to(handlers::students::get_student))
                    .route("/{id}", web::put().to(handlers::students::update_student))
                    .route("/{id}", web::delete().to(handlers::students::delete_student)),
            )
            // 教师管理路由
            .service(
                web::scope("/teachers")
                    .route("", web::get().to(handlers::teachers::get_teachers))
                    .route("", web::post().to(handlers::teachers::create_teacher))
                    .route("/{id}", web::get().to(handlers::teachers::get_teacher))
                    .route("/{id}", web::put().to(handlers::teachers::update_teacher))
                    .route("/{id}", web::delete().to(handlers::teachers::delete_teacher)),
            )
            // 获奖管理路由
            .service(
                web::scope("/awards")
                    .route("", web::get().to(handlers::awards::get_awards))
                    .route("", web::post().to(handlers::awards::create_award))
                    .route("/{id}", web::get().to(handlers::awards::get_award))
                    .route("/{id}", web::put().to(handlers::awards::update_award))
                    .route("/{id}", web::delete().to(handlers::awards::delete_award)),
            )
            // 论文管理路由
            .service(
                web::scope("/papers")
                    .route("", web::get().to(handlers::papers::get_papers))
                    .route("", web::post().to(handlers::papers::create_paper))
                    .route("/{id}", web::get().to(handlers::papers::get_paper))
                    .route("/{id}", web::put().to(handlers::papers::update_paper))
                    .route("/{id}", web::delete().to(handlers::papers::delete_paper)),
            ),
    );
    // 其余路径交由前端静态资源处理（内嵌于 exe）
    cfg.route("/{tail:.*}", web::get().to(serve_frontend));
}

async fn create_initial_admin(pool: &db::DbPool) {
    use bcrypt::{hash, DEFAULT_COST};

    // 检查是否已存在管理员
    let existing: Option<models::User> =
        sqlx::query_as("SELECT * FROM users WHERE username = ?")
            .bind("admin")
            .fetch_optional(pool)
            .await
            .ok()
            .flatten();

    if existing.is_none() {
        let hashed_password = hash("admin123", DEFAULT_COST).expect("Failed to hash password");

        let result: Result<models::User, _> = sqlx::query_as(
            "INSERT INTO users (username, password, role) VALUES (?, ?, 'admin') RETURNING *"
        )
        .bind("admin")
        .bind(&hashed_password)
        .fetch_one(pool)
        .await;

        match result {
            Ok(_) => tracing::info!("初始管理员账户已创建 (用户名：admin, 密码：admin123)"),
            Err(e) => tracing::error!("创建管理员账户失败：{}", e),
        }
    }
}
