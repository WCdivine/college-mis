use actix_web::{web, Error, HttpResponse};
use serde::Deserialize;

use crate::db::DbPool;
use crate::middleware::auth::Claims;
use crate::models::{
    ApiResponse, CreateTeacherRequest, Teacher,
};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TeacherQuery {
    pub search: Option<String>,
}

pub async fn get_teachers(
    pool: web::Data<DbPool>,
    claims: Claims,
    query: Option<web::Query<TeacherQuery>>,
) -> Result<HttpResponse, Error> {
    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以访问教师列表")));
    }

    let teachers = if let Some(q) = &query {
        // 带搜索的查询
        let search = format!("%{}%", q.search.as_deref().unwrap_or(""));
        sqlx::query_as::<_, Teacher>(
            "SELECT * FROM teachers WHERE name LIKE ? OR employee_id LIKE ? OR department LIKE ? ORDER BY id ASC",
        )
        .bind(&search)
        .bind(&search)
        .bind(&search)
        .fetch_all(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?
    } else {
        sqlx::query_as::<_, Teacher>("SELECT * FROM teachers ORDER BY id ASC")
            .fetch_all(pool.get_ref())
            .await
            .map_err(|e| actix_web::error::ErrorInternalServerError(e))?
    };

    Ok(HttpResponse::Ok().json(ApiResponse::success(teachers)))
}

pub async fn get_teacher(
    pool: web::Data<DbPool>,
    claims: Claims,
    path: web::Path<i64>,
) -> Result<HttpResponse, Error> {
    let teacher_id = path.into_inner();

    // 检查权限
    if claims.role != "admin" && claims.role != "student" {
        // 教师只能查看自己的信息
        if claims.role == "teacher" {
            let teacher: Option<Teacher> = sqlx::query_as(
                "SELECT * FROM teachers WHERE id = ? AND user_id = ?"
            )
            .bind(teacher_id)
            .bind(claims.sub)
            .fetch_optional(pool.get_ref())
            .await
            .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

            if let Some(t) = teacher {
                return Ok(HttpResponse::Ok().json(ApiResponse::success(t)));
            }
        }
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("无权访问该教师信息")));
    }

    let teacher: Option<Teacher> = sqlx::query_as("SELECT * FROM teachers WHERE id = ?")
        .bind(teacher_id)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    match teacher {
        Some(t) => Ok(HttpResponse::Ok().json(ApiResponse::success(t))),
        None => Ok(HttpResponse::NotFound()
            .json(ApiResponse::<()>::error("教师不存在"))),
    }
}

pub async fn create_teacher(
    pool: web::Data<DbPool>,
    claims: Claims,
    body: web::Json<CreateTeacherRequest>,
) -> Result<HttpResponse, Error> {
    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以创建教师")));
    }

    let teacher = body.into_inner();

    // 检查工号是否存在
    let existing: Option<Teacher> = sqlx::query_as("SELECT * FROM teachers WHERE employee_id = ?")
        .bind(&teacher.employee_id)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    if existing.is_some() {
        return Ok(HttpResponse::Conflict()
            .json(ApiResponse::<()>::error("工号已存在")));
    }

    // 创建关联用户账户
    let username = format!("teacher_{}", teacher.employee_id);
    let default_password = "123456"; // 默认密码
    let hashed_password = bcrypt::hash(default_password, bcrypt::DEFAULT_COST)
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    let user_result = sqlx::query_as::<_, crate::models::User>(
        "INSERT INTO users (username, password, role) VALUES (?, ?, 'teacher') RETURNING *"
    )
    .bind(&username)
    .bind(&hashed_password)
    .fetch_one(pool.get_ref())
    .await
    .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    // 创建教师记录
    let new_teacher = sqlx::query_as::<_, Teacher>(
        "INSERT INTO teachers (user_id, name, employee_id, department, title, hire_date) VALUES (?, ?, ?, ?, ?, ?) RETURNING *"
    )
    .bind(user_result.id)
    .bind(&teacher.name)
    .bind(&teacher.employee_id)
    .bind(&teacher.department)
    .bind(&teacher.title)
    .bind(&teacher.hire_date)
    .fetch_one(pool.get_ref())
    .await
    .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    Ok(HttpResponse::Created().json(ApiResponse::success(new_teacher)))
}

pub async fn update_teacher(
    pool: web::Data<DbPool>,
    claims: Claims,
    path: web::Path<i64>,
    body: web::Json<CreateTeacherRequest>,
) -> Result<HttpResponse, Error> {
    let teacher_id = path.into_inner();

    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以更新教师信息")));
    }

    let teacher = body.into_inner();

    // 更新教师记录
    let updated_teacher = sqlx::query_as::<_, Teacher>(
        "UPDATE teachers SET name = ?, employee_id = ?, department = ?, title = ?, hire_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *"
    )
    .bind(&teacher.name)
    .bind(&teacher.employee_id)
    .bind(&teacher.department)
    .bind(&teacher.title)
    .bind(&teacher.hire_date)
    .bind(teacher_id)
    .fetch_one(pool.get_ref())
    .await
    .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    Ok(HttpResponse::Ok().json(ApiResponse::success(updated_teacher)))
}

pub async fn delete_teacher(
    pool: web::Data<DbPool>,
    claims: Claims,
    path: web::Path<i64>,
) -> Result<HttpResponse, Error> {
    let teacher_id = path.into_inner();

    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以删除教师")));
    }

    // 先获取教师记录，找到关联的 user_id
    let teacher: Option<crate::models::Teacher> = sqlx::query_as("SELECT * FROM teachers WHERE id = ?")
        .bind(teacher_id)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    if teacher.is_none() {
        return Ok(HttpResponse::NotFound()
            .json(ApiResponse::<()>::error("教师不存在")));
    }

    let user_id = teacher.unwrap().user_id;

    // 使用事务确保同时删除教师记录和关联的用户账户
    let mut tx = pool.get_ref().begin()
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    // 删除教师记录
    sqlx::query("DELETE FROM teachers WHERE id = ?")
        .bind(teacher_id)
        .execute(&mut *tx)
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    // 删除关联的用户账户
    sqlx::query("DELETE FROM users WHERE id = ?")
        .bind(user_id)
        .execute(&mut *tx)
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    // 提交事务
    tx.commit()
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    Ok(HttpResponse::Ok().json(ApiResponse::success(true)))
}
