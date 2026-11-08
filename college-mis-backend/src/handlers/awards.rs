use actix_web::{web, Error, HttpResponse};
use serde::Deserialize;

use crate::db::DbPool;
use crate::middleware::auth::Claims;
use crate::models::{
    ApiResponse, Award, CreateAwardRequest,
};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AwardQuery {
    pub owner_id: Option<i64>,
    pub owner_type: Option<String>,
}

pub async fn get_awards(
    pool: web::Data<DbPool>,
    claims: Claims,
    query: Option<web::Query<AwardQuery>>,
) -> Result<HttpResponse, Error> {
    let awards = if let Some(q) = &query {
        // 带过滤的查询
        if let Some(owner_id) = q.owner_id {
            let owner_type = q.owner_type.as_deref().unwrap_or("student");
            sqlx::query_as::<_, Award>(
                "SELECT * FROM awards WHERE owner_id = ? AND owner_type = ? ORDER BY date DESC",
            )
            .bind(owner_id)
            .bind(owner_type)
            .fetch_all(pool.get_ref())
            .await
            .map_err(|e| actix_web::error::ErrorInternalServerError(e))?
        } else {
            // 管理员可以查看所有奖项
            if claims.role != "admin" {
                return Ok(HttpResponse::Forbidden()
                    .json(ApiResponse::<()>::error("无权访问奖项列表")));
            }
            sqlx::query_as::<_, Award>("SELECT * FROM awards ORDER BY date DESC")
                .fetch_all(pool.get_ref())
                .await
                .map_err(|e| actix_web::error::ErrorInternalServerError(e))?
        }
    } else {
        // 管理员可以查看所有奖项
        if claims.role != "admin" {
            return Ok(HttpResponse::Forbidden()
                .json(ApiResponse::<()>::error("无权访问奖项列表")));
        }
        sqlx::query_as::<_, Award>("SELECT * FROM awards ORDER BY date DESC")
            .fetch_all(pool.get_ref())
            .await
            .map_err(|e| actix_web::error::ErrorInternalServerError(e))?
    };

    Ok(HttpResponse::Ok().json(ApiResponse::success(awards)))
}

pub async fn get_award(
    pool: web::Data<DbPool>,
    _claims: Claims,
    path: web::Path<i64>,
) -> Result<HttpResponse, Error> {
    let award_id = path.into_inner();

    let award: Option<Award> = sqlx::query_as("SELECT * FROM awards WHERE id = ?")
        .bind(award_id)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    match award {
        Some(a) => Ok(HttpResponse::Ok().json(ApiResponse::success(a))),
        None => Ok(HttpResponse::NotFound()
            .json(ApiResponse::<()>::error("奖项不存在"))),
    }
}

pub async fn create_award(
    pool: web::Data<DbPool>,
    claims: Claims,
    body: web::Json<CreateAwardRequest>,
) -> Result<HttpResponse, Error> {
    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以创建奖项")));
    }

    let award = body.into_inner();

    // 验证 owner_type
    if !["student", "teacher"].contains(&award.owner_type.as_str()) {
        return Ok(HttpResponse::BadRequest()
            .json(ApiResponse::<()>::error("无效的拥有者类型")));
    }

    // 创建奖项记录
    let new_award = sqlx::query_as::<_, Award>(
        "INSERT INTO awards (owner_id, owner_type, title, level, date, description) VALUES (?, ?, ?, ?, ?, ?) RETURNING *"
    )
    .bind(award.owner_id)
    .bind(&award.owner_type)
    .bind(&award.title)
    .bind(&award.level)
    .bind(&award.date)
    .bind(&award.description)
    .fetch_one(pool.get_ref())
    .await
    .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    Ok(HttpResponse::Created().json(ApiResponse::success(new_award)))
}

pub async fn update_award(
    pool: web::Data<DbPool>,
    claims: Claims,
    path: web::Path<i64>,
    body: web::Json<CreateAwardRequest>,
) -> Result<HttpResponse, Error> {
    let award_id = path.into_inner();

    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以更新奖项")));
    }

    let award = body.into_inner();

    // 更新奖项记录
    let updated_award = sqlx::query_as::<_, Award>(
        "UPDATE awards SET owner_id = ?, owner_type = ?, title = ?, level = ?, date = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *"
    )
    .bind(award.owner_id)
    .bind(&award.owner_type)
    .bind(&award.title)
    .bind(&award.level)
    .bind(&award.date)
    .bind(&award.description)
    .bind(award_id)
    .fetch_one(pool.get_ref())
    .await
    .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    Ok(HttpResponse::Ok().json(ApiResponse::success(updated_award)))
}

pub async fn delete_award(
    pool: web::Data<DbPool>,
    claims: Claims,
    path: web::Path<i64>,
) -> Result<HttpResponse, Error> {
    let award_id = path.into_inner();

    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以删除奖项")));
    }

    let result = sqlx::query("DELETE FROM awards WHERE id = ?")
        .bind(award_id)
        .execute(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    if result.rows_affected() == 0 {
        return Ok(HttpResponse::NotFound()
            .json(ApiResponse::<()>::error("奖项不存在")));
    }

    Ok(HttpResponse::Ok().json(ApiResponse::success(true)))
}
