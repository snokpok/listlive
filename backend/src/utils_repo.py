class UtilsRepository:
    @staticmethod
    def parse_configs_to_dburl(username: str, password: str, db: str) -> str:
        return f"mongodb://{username}:{password}@mongo:27017/{db}"
