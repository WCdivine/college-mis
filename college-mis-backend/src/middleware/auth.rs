use actix_web::{Error, FromRequest, HttpRequest};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::future::{Ready, ready};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Claims {
    pub sub: i64,
    pub username: String,
    pub role: String,
    pub exp: usize,
}

impl Claims {
    pub fn new(user_id: i64, username: String, role: String) -> Self {
        use chrono::{Duration, Utc};
        let expiration = Utc::now()
            .checked_add_signed(Duration::days(7))
            .expect("valid timestamp")
            .timestamp() as usize;

        Self {
            sub: user_id,
            username,
            role,
            exp: expiration,
        }
    }
}

pub fn create_token(user_id: i64, username: String, role: String) -> Result<String, Error> {
    let claims = Claims::new(user_id, username, role);
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "secret".to_string());
    
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|e| actix_web::error::ErrorInternalServerError(format!("Token error: {}", e)))
}

pub fn verify_token(token: &str) -> Result<Claims, Error> {
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "secret".to_string());
    
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )
    .map(|data| data.claims)
    .map_err(|e| actix_web::error::ErrorUnauthorized(format!("Invalid token: {}", e)))
}

impl FromRequest for Claims {
    type Error = Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _payload: &mut actix_web::dev::Payload) -> Self::Future {
        let auth_header = req.headers()
            .get("Authorization")
            .and_then(|h| h.to_str().ok());

        match auth_header {
            Some(header) => {
                if header.starts_with("Bearer ") {
                    let token = &header[7..];
                    match verify_token(token) {
                        Ok(claims) => ready(Ok(claims)),
                        Err(e) => ready(Err(e)),
                    }
                } else {
                    ready(Err(actix_web::error::ErrorUnauthorized("Invalid authorization header")))
                }
            }
            None => ready(Err(actix_web::error::ErrorUnauthorized("Missing authorization header"))),
        }
    }
}
