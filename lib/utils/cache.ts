interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

class Cache {
    private cache: Map<string, CacheEntry<any>>;

    constructor() {
        this.cache = new Map();
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    // Default TTL is 60s to avoid rate limiting
    set<T>(key: string, data: T, ttl: number = 60000): void {
        this.cache.set(key, {
            data,
            expiresAt: Date.now() + ttl
        });
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}

export const cache = new Cache();
