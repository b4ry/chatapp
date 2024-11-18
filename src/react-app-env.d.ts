/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
      readonly REACT_APP_CERBERUS_API_AUTH_LOGIN_URL: string;
      readonly REACT_APP_CERBERUS_API_AUTH_REGISTER_URL: string;
      readonly REACT_APP_SOCRATES_API_URL: string;
      readonly REACT_APP_ENVIRONMENT: "development" | "production";
    }
}