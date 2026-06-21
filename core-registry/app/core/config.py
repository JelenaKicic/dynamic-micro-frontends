from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # NOTE: SQLAlchemy needs the "postgresql+psycopg2" scheme (not the bare "postgres" scheme).
    database_url: str = (
        "postgresql+psycopg2://postgres:1234@localhost:5432/dynamic-microfrontends"
    )

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
