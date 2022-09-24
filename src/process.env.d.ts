declare namespace NodeJS {
    export interface ProcessEnv {
        DB_NAME: string;
        DB_HOST: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;
        
        API_PORT: number;
        ADMINJS_COOKIE_PASSWORD: string;
        ADMINJS_PORT: number;
        
        ENVIRONMENT: 'development' | 'production';
    }
}