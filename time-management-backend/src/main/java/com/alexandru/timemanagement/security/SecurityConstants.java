package com.alexandru.timemanagement.security;

public class SecurityConstants {
    public static final String SECRET = "SecretKeyToGenJWTs";
    public static final long EXPIRATION_TIME = 86_400_000; // 1 day
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String API_USER = "/api/user/**";
    public static final String ENDPOINT_CREATE_OR_UPDATE_FOR_USER = "/api/note/createOrUpdateForUser";
}
