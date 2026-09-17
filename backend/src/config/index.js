try {
    process.loadEnvFile?.();
} catch {
    // Menggunakan fallback nilai default jika .env belum tersedia
}

export const config = {
    port: Number(process.env.PORT) || 3030,
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    },
    mysql: {
        promise: true,
        connectionString: process.env.DB_CONNECTION_STRING || 'mysql://root:@localhost:3306/db_exam',
        connectionLimit: 100,
        queueLimit: 0,
        waitForConnections: true
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'supersecret_kunci_rahasia_ujian',
        expiresIn: '1d'
    },
    swaggerAuth: {
        username: process.env.SWAGGER_USER || 'admin',
        password: process.env.SWAGGER_PASS || 'examflow789'
    }
};
