use actix_web::{web, Error, HttpResponse};
use serde::Deserialize;

use crate::db::DbPool;
use crate::middleware::auth::Claims;
use crate::models::{
    ApiResponse, CreateStudentRequest, Student,
};

pub async fn get_students(
    pool: web::Data<DbPool>,
    claims: Claims,
    query: Option<web::Query<StudentQuery>>,
) -> Result<HttpResponse, Error> {
    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以访问学生列表")));
    }

    let students = if let Some(q) = &query {
        // 带搜索的查询
        let search = format!("%{}%", q.search.as_deref().unwrap_or(""));
        sqlx::query_as::<_, Student>(
            "SELECT * FROM students WHERE name LIKE ? OR student_id LIKE ? OR department LIKE ? ORDER BY id ASC",
        )
        .bind(&search)
        .bind(&search)
        .bind(&search)
        .fetch_all(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?
    } else {
        sqlx::query_as::<_, Student>("SELECT * FROM students ORDER BY id ASC")
            .fetch_all(pool.get_ref())
            .await
            .map_err(|e| actix_web::error::ErrorInternalServerError(e))?
    };

    Ok(HttpResponse::Ok().json(ApiResponse::success(students)))
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StudentQuery {
    pub search: Option<String>,
}

pub async fn get_student(
    pool: web::Data<DbPool>,
    claims: Claims,
    path: web::Path<i64>,
) -> Result<HttpResponse, Error> {
    let student_id = path.into_inner();

    // 检查权限
    if claims.role != "admin" && claims.role != "teacher" {
        // 学生只能查看自己的信息
        if claims.role == "student" {
            let student: Option<Student> = sqlx::query_as(
                "SELECT * FROM students WHERE id = ? AND user_id = ?"
            )
            .bind(student_id)
            .bind(claims.sub)
            .fetch_optional(pool.get_ref())
            .await
            .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

            if let Some(s) = student {
                return Ok(HttpResponse::Ok().json(ApiResponse::success(s)));
            }
        }
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("无权访问该学生信息")));
    }

    let student: Option<Student> = sqlx::query_as("SELECT * FROM students WHERE id = ?")
        .bind(student_id)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    match student {
        Some(s) => Ok(HttpResponse::Ok().json(ApiResponse::success(s))),
        None => Ok(HttpResponse::NotFound()
            .json(ApiResponse::<()>::error("学生不存在"))),
    }
}

pub async fn create_student(
    pool: web::Data<DbPool>,
    claims: Claims,
    body: web::Json<CreateStudentRequest>,
) -> Result<HttpResponse, Error> {
    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以创建学生")));
    }

    let student = body.into_inner();

    // 检查学号是否存在
    let existing: Option<Student> = sqlx::query_as("SELECT * FROM students WHERE student_id = ?")
        .bind(&student.student_id)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    if existing.is_some() {
        return Ok(HttpResponse::Conflict()
            .json(ApiResponse::<()>::error("学号已存在")));
    }

    // 创建关联用户账户
    let username = format!("student_{}", student.student_id);
    let default_password = "123456"; // 默认密码
    let hashed_password = bcrypt::hash(default_password, bcrypt::DEFAULT_COST)
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    let user_result = match sqlx::query_as::<_, crate::models::User>(
        "INSERT INTO users (username, password, role) VALUES (?, ?, 'student') RETURNING *"
    )
    .bind(&username)
    .bind(&hashed_password)
    .fetch_one(pool.get_ref())
    .await {
        Ok(user) => user,
        Err(e) => {
            if e.to_string().contains("UNIQUE constraint failed") {
                return Ok(HttpResponse::Conflict()
                    .json(ApiResponse::<()>::error("学号已存在，无法创建")));
            } else {
                return Err(actix_web::error::ErrorInternalServerError(e));
            }
        }
    };

    // 创建学生记录
    let new_student = sqlx::query_as::<_, Student>(
        "INSERT INTO students (user_id, name, student_id, department, major, enrollment_year) VALUES (?, ?, ?, ?, ?, ?) RETURNING *"
    )
    .bind(user_result.id)
    .bind(&student.name)
    .bind(&student.student_id)
    .bind(&student.department)
    .bind(&student.major)
    .bind(student.enrollment_year)
    .fetch_one(pool.get_ref())
    .await
    .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    Ok(HttpResponse::Created().json(ApiResponse::success(new_student)))
}

pub async fn update_student(
    pool: web::Data<DbPool>,
    claims: Claims,
    path: web::Path<i64>,
    body: web::Json<CreateStudentRequest>,
) -> Result<HttpResponse, Error> {
    let student_id = path.into_inner();

    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以更新学生信息")));
    }

    let student = body.into_inner();

    // 更新学生记录
    let updated_student = sqlx::query_as::<_, Student>(
        "UPDATE students SET name = ?, student_id = ?, department = ?, major = ?, enrollment_year = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *"
    )
    .bind(&student.name)
    .bind(&student.student_id)
    .bind(&student.department)
    .bind(&student.major)
    .bind(student.enrollment_year)
    .bind(student_id)
    .fetch_one(pool.get_ref())
    .await
    .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    Ok(HttpResponse::Ok().json(ApiResponse::success(updated_student)))
}

pub async fn delete_student(
    pool: web::Data<DbPool>,
    claims: Claims,
    path: web::Path<i64>,
) -> Result<HttpResponse, Error> {
    let student_id = path.into_inner();

    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以删除学生")));
    }

    // 先获取学生记录，找到关联的 user_id
    let student: Option<crate::models::Student> = sqlx::query_as("SELECT * FROM students WHERE id = ?")
        .bind(student_id)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    if student.is_none() {
        return Ok(HttpResponse::NotFound()
            .json(ApiResponse::<()>::error("学生不存在")));
    }

    let user_id = student.unwrap().user_id;

    // 使用事务确保同时删除学生记录和关联的用户账户
    let mut tx = pool.get_ref().begin()
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    // 删除学生记录
    sqlx::query("DELETE FROM students WHERE id = ?")
        .bind(student_id)
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
