use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: i64,
    pub username: String,
    #[serde(skip_serializing)]
    pub password: String,
    pub role: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Student {
    pub id: i64,
    pub user_id: i64,
    pub name: String,
    pub student_id: String,
    pub department: String,
    pub major: String,
    pub enrollment_year: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Teacher {
    pub id: i64,
    pub user_id: i64,
    pub name: String,
    pub employee_id: String,
    pub department: String,
    pub title: String,
    pub hire_date: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Award {
    pub id: i64,
    pub owner_id: i64,
    pub owner_type: String,
    pub title: String,
    pub level: String,
    pub date: String,
    pub description: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Paper {
    pub id: i64,
    pub owner_id: i64,
    pub owner_type: String,
    pub title: String,
    pub journal: Option<String>,
    pub publish_date: String,
    pub authors: String,
    pub doi: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

// 创建请求/响应 DTO
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateUserRequest {
    pub username: String,
    pub password: String,
    pub role: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    pub token: String,
    pub user: UserResponse,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserResponse {
    pub id: i64,
    pub username: String,
    pub role: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateStudentRequest {
    pub name: String,
    pub student_id: String,
    pub department: String,
    pub major: String,
    pub enrollment_year: i32,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateTeacherRequest {
    pub name: String,
    pub employee_id: String,
    pub department: String,
    pub title: String,
    pub hire_date: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateAwardRequest {
    pub owner_id: i64,
    pub owner_type: String,
    pub title: String,
    pub level: String,
    pub date: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatePaperRequest {
    pub owner_id: i64,
    pub owner_type: String,
    pub title: String,
    pub journal: Option<String>,
    pub publish_date: String,
    pub authors: String,
    pub doi: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub message: Option<String>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            message: None,
        }
    }

    pub fn error(message: &str) -> Self 
    where
        T: Default,
    {
        Self {
            success: false,
            data: None,
            message: Some(message.to_string()),
        }
    }
}
