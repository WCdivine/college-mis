use actix_web::{web, Error, HttpResponse};
use bcrypt::{hash, verify, DEFAULT_COST};

use crate::db::DbPool;
use crate::middleware::auth::{create_token, Claims};
use crate::models::{
    ApiResponse, CreateUserRequest, LoginRequest, LoginResponse, User, UserResponse,
};

pub async fn register(
    pool: web::Data<DbPool>,
    body: web::Json<CreateUserRequest>,
) -> Result<HttpResponse, Error> {
    let username = body.username.trim();
    let password = &body.password;
    let role = body.role.to_lowercase();

    // 验证角色
    if !["student", "teacher", "admin"].contains(&role.as_str()) {
        return Ok(HttpResponse::BadRequest().json(ApiResponse::<()>::error("无效的用户角色")));
    }

    // 检查用户名是否存在
    let existing: Option<User> = sqlx::query_as("SELECT * FROM users WHERE username = ?")
        .bind(username)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    if existing.is_some() {
        return Ok(HttpResponse::Conflict().json(ApiResponse::<()>::error("用户名已存在")));
    }

    // 加密密码
    let hashed_password = hash(password, DEFAULT_COST)
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    // 插入用户
    let result = sqlx::query_as::<_, User>(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?) RETURNING *",
    )
    .bind(username)
    .bind(&hashed_password)
    .bind(&role)
    .fetch_one(pool.get_ref())
    .await
    .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    let user_response = UserResponse {
        id: result.id,
        username: result.username,
        role: result.role,
    };

    Ok(HttpResponse::Created().json(ApiResponse::success(user_response)))
}

pub async fn login(
    pool: web::Data<DbPool>,
    body: web::Json<LoginRequest>,
) -> Result<HttpResponse, Error> {
    let username = body.username.trim();
    let password = &body.password;

    // 查找用户
    let user: Option<User> = sqlx::query_as("SELECT * FROM users WHERE username = ?")
        .bind(username)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    let user = match user {
        Some(u) => u,
        None => {
            return Ok(HttpResponse::Unauthorized()
                .json(ApiResponse::<()>::error("用户名或密码错误")));
        }
    };

    // 验证密码
    let valid = verify(password, &user.password)
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    if !valid {
        return Ok(HttpResponse::Unauthorized()
            .json(ApiResponse::<()>::error("用户名或密码错误")));
    }

    // 生成 token
    let token = create_token(user.id, user.username.clone(), user.role.clone())?;

    let user_response = UserResponse {
        id: user.id,
        username: user.username,
        role: user.role,
    };

    let response = LoginResponse {
        token,
        user: user_response,
    };

    Ok(HttpResponse::Ok().json(ApiResponse::success(response)))
}

pub async fn get_current_user(
    pool: web::Data<DbPool>,
    claims: Claims,
) -> Result<HttpResponse, Error> {
    let user: Option<User> = sqlx::query_as("SELECT * FROM users WHERE id = ?")
        .bind(claims.sub)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    match user {
        Some(u) => {
            let user_response = UserResponse {
                id: u.id,
                username: u.username,
                role: u.role,
            };
            Ok(HttpResponse::Ok().json(ApiResponse::success(user_response)))
        }
        None => Ok(HttpResponse::NotFound().json(ApiResponse::<()>::error("用户不存在"))),
    }
}
