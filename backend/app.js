import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyMysql from '@fastify/mysql';
import fastifyJwt from '@fastify/jwt';
import fastifyBasicAuth from '@fastify/basic-auth';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import routes from './src/routes/index.js';
import { config } from './src/config/index.js';
import { initDatabase } from './src/config/database.js';

const fastify = Fastify({
    logger: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

        transport: process.env.NODE_ENV !== 'production' ? {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            }
        } : undefined,
    }
});

// Plugins registration
fastify.register(fastifyCors, {
    origin: config.cors.origin,
    methods: config.cors.methods
});

fastify.register(fastifyMysql, {
    promise: config.mysql.promise,
    connectionString: config.mysql.connectionString,
    connectionLimit: config.mysql.connectionLimit,
    queueLimit: config.mysql.queueLimit,
    waitForConnections: config.mysql.waitForConnections
});

fastify.register(fastifyJwt, {
    secret: config.jwt.secret
});

const validateSwaggerAuth = async function (username, password) {
    if (
        username !== config.swaggerAuth.username ||
        password !== config.swaggerAuth.password
    ) {
        return new Error('Akses Ditolak: Username atau Password salah');
    }
};

fastify.register(fastifyBasicAuth, {
    validate: validateSwaggerAuth,
    authenticate: true
});

fastify.register(fastifySwagger, {
    swagger: {
        info: {
            title: 'ExamFlow API',
            description: 'Dokumentasi API untuk Aplikasi Ujian (ExamFlow)',
            version: '1.0.0'
        },
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            }
        }
    }
});

fastify.register(fastifySwaggerUi, {
    routePrefix: '/api/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false
    },
    uiHooks: {
        onRequest: function (request, reply, next) {
            fastify.basicAuth(request, reply, next);
        }
    }
});

// Application routes
fastify.register(routes);

fastify.all('/', (req, res) => {
    res.send('Hello World');
});

fastify.setNotFoundHandler((req, res) => {
    res.status(404).send({
        status: 404,
        message: 'Route Not Found'
    });
});

fastify.setErrorHandler((err, req, res) => {
    console.log(err);
    if (err.statusCode === 401) {
        res.header('WWW-Authenticate', 'Basic realm="ExamFlow API Docs"');
        return res.status(401).send({
            status: 401,
            message: 'Harap masukkan username dan password'
        });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({
        status: statusCode,
        message: err.message || 'Internal Server Error'
    });
});

fastify.ready(async (err) => {
    if (err) {
        console.log('Ada kesalahan saat memuat fastify: ', err);
        process.exit(1);
    }

    try {
        await initDatabase(fastify);
    } catch (error) {
        console.log('Ada kesalahan saat memuat database: ', error);
        process.exit(1);
    }
});

try {
    fastify.listen({ port: config.port }, () => {
        console.log(`Server is running on port http://localhost:${config.port}`);
    });
} catch (error) {
    console.log(error);
    process.exit(1);
}