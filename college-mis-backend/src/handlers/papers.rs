use actix_web::{web, Error, HttpResponse};
use serde::Deserialize;

use crate::db::DbPool;
use crate::middleware::auth::Claims;
use crate::models::{
    ApiResponse, CreatePaperRequest, Paper,
};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PaperQuery {
    pub owner_id: Option<i64>,
    pub owner_type: Option<String>,
}

pub async fn get_papers(
    pool: web::Data<DbPool>,
    claims: Claims,
    query: Option<web::Query<PaperQuery>>,
) -> Result<HttpResponse, Error> {
    let papers = if let Some(q) = &query {
        // 带过滤的查询
        if let Some(owner_id) = q.owner_id {
            let owner_type = q.owner_type.as_deref().unwrap_or("student");
            sqlx::query_as::<_, Paper>(
                "SELECT * FROM papers WHERE owner_id = ? AND owner_type = ? ORDER BY publish_date DESC",
            )
            .bind(owner_id)
            .bind(owner_type)
            .fetch_all(pool.get_ref())
            .await
            .map_err(|e| actix_web::error::ErrorInternalServerError(e))?
        } else {
            // 管理员可以查看所有论文
            if claims.role != "admin" {
                return Ok(HttpResponse::Forbidden()
                    .json(ApiResponse::<()>::error("无权访问论文列表")));
            }
            sqlx::query_as::<_, Paper>("SELECT * FROM papers ORDER BY publish_date DESC")
                .fetch_all(pool.get_ref())
                .await
                .map_err(|e| actix_web::error::ErrorInternalServerError(e))?
        }
    } else {
        // 管理员可以查看所有论文
        if claims.role != "admin" {
            return Ok(HttpResponse::Forbidden()
                .json(ApiResponse::<()>::error("无权访问论文列表")));
        }
        sqlx::query_as::<_, Paper>("SELECT * FROM papers ORDER BY publish_date DESC")
            .fetch_all(pool.get_ref())
            .await
            .map_err(|e| actix_web::error::ErrorInternalServerError(e))?
    };

    Ok(HttpResponse::Ok().json(ApiResponse::success(papers)))
}

pub async fn get_paper(
    pool: web::Data<DbPool>,
    _claims: Claims,
    path: web::Path<i64>,
) -> Result<HttpResponse, Error> {
    let paper_id = path.into_inner();

    let paper: Option<Paper> = sqlx::query_as("SELECT * FROM papers WHERE id = ?")
        .bind(paper_id)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    match paper {
        Some(p) => Ok(HttpResponse::Ok().json(ApiResponse::success(p))),
        None => Ok(HttpResponse::NotFound()
            .json(ApiResponse::<()>::error("论文不存在"))),
    }
}

pub async fn create_paper(
    pool: web::Data<DbPool>,
    claims: Claims,
    body: web::Json<CreatePaperRequest>,
) -> Result<HttpResponse, Error> {
    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以创建论文")));
    }

    let paper = body.into_inner();

    // 验证 owner_type
    if !["student", "teacher"].contains(&paper.owner_type.as_str()) {
        return Ok(HttpResponse::BadRequest()
            .json(ApiResponse::<()>::error("无效的拥有者类型")));
    }

    // 创建论文记录
    let new_paper = sqlx::query_as::<_, Paper>(
        "INSERT INTO papers (owner_id, owner_type, title, journal, publish_date, authors, doi) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *"
    )
    .bind(paper.owner_id)
    .bind(&paper.owner_type)
    .bind(&paper.title)
    .bind(&paper.journal)
    .bind(&paper.publish_date)
    .bind(&paper.authors)
    .bind(&paper.doi)
    .fetch_one(pool.get_ref())
    .await
    .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    Ok(HttpResponse::Created().json(ApiResponse::success(new_paper)))
}

pub async fn update_paper(
    pool: web::Data<DbPool>,
    claims: Claims,
    path: web::Path<i64>,
    body: web::Json<CreatePaperRequest>,
) -> Result<HttpResponse, Error> {
    let paper_id = path.into_inner();

    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以更新论文")));
    }

    let paper = body.into_inner();

    // 更新论文记录
    let updated_paper = sqlx::query_as::<_, Paper>(
        "UPDATE papers SET owner_id = ?, owner_type = ?, title = ?, journal = ?, publish_date = ?, authors = ?, doi = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *"
    )
    .bind(paper.owner_id)
    .bind(&paper.owner_type)
    .bind(&paper.title)
    .bind(&paper.journal)
    .bind(&paper.publish_date)
    .bind(&paper.authors)
    .bind(&paper.doi)
    .bind(paper_id)
    .fetch_one(pool.get_ref())
    .await
    .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    Ok(HttpResponse::Ok().json(ApiResponse::success(updated_paper)))
}

pub async fn delete_paper(
    pool: web::Data<DbPool>,
    claims: Claims,
    path: web::Path<i64>,
) -> Result<HttpResponse, Error> {
    let paper_id = path.into_inner();

    // 检查权限
    if claims.role != "admin" {
        return Ok(HttpResponse::Forbidden()
            .json(ApiResponse::<()>::error("只有管理员可以删除论文")));
    }

    let result = sqlx::query("DELETE FROM papers WHERE id = ?")
        .bind(paper_id)
        .execute(pool.get_ref())
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    if result.rows_affected() == 0 {
        return Ok(HttpResponse::NotFound()
            .json(ApiResponse::<()>::error("论文不存在")));
    }

    Ok(HttpResponse::Ok().json(ApiResponse::success(true)))
}
