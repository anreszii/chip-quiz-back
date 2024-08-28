import Redis from "ioredis";

const redis = new Redis();

class StorageService {
  getFromCache = async (key: string): Promise<string | null> => {
    try {
      return await redis.get(key);
    } catch (error) {
      console.error("Ошибка получения данных из кэша:", error);
      throw error;
    }
  };

  setToCache = async (
    key: string,
    value: string,
    ttl: number = 3600
  ): Promise<void> => {
    try {
      await redis.set(key, value, "EX", ttl);
    } catch (error) {
      console.error("Ошибка сохранения данных в кэше:", error);
      throw error;
    }
  };

  setToInfinityCache = async (key: string, value: string): Promise<void> => {
    try {
      await redis.set(key, value);
    } catch (error) {
      console.error("Ошибка сохранения данных в кэше:", error);
      throw error;
    }
  };

  deleteFromCache = async (key: string): Promise<void> => {
    try {
      await redis.del(key);
    } catch (error) {
      console.error("Ошибка удаления данных из кэша:", error);
      throw error;
    }
  };
}

export const storageService = new StorageService();
