import Fastify from "fastify";
import routes from "./src/routes/index.js";
import fastifyMysql from "@fastify/mysql";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyBasicAuth from "@fastify/basic-auth";

const fastify = Fastify();
const PORT = 3000;

//Bagian Register Disini
fastify.register(cors, {
    origin: '*', // Untuk tahap development gapapa bintang, nanti kalau udah production ganti ke origin frontend-nya ya.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

fastify.register(fastifyMysql, {
    promise: true,
    connectionString: 'mysql://root:alga5y6y7@localhost:3306/db_ujian',
    connectionLimit: 100,
    queueLimit:0,
    waitForConnections: true,
})


fastify.register(fastifyJwt, {
    secret: 'supersecret_kunci_rahasia_ujian'
})

// === BASIC AUTH UNTUK SWAGGER ===
const validate = async function (username, password, req, reply) {
    if (username !== 'admin' || password !== 'examflow789') {
        return new Error('Akses Ditolak: Username atau Password salah');
    }
}
fastify.register(fastifyBasicAuth, { validate, authenticate: true });

// === SWAGGER API DOCS ===
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
            fastify.basicAuth(request, reply, next)
        }
    }
});

fastify.register(routes)

fastify.all('/', (req, res) => {
    res.send('Hello World')
})
fastify.setNotFoundHandler((req, res) => {
    res.status(404).send({
        status: 404,
        message: 'Route Not Found'
    })
})
fastify.setErrorHandler((err, req, res) => {
    console.log(err)
    if (err.statusCode === 401) {
        res.header('WWW-Authenticate', 'Basic realm="ExamFlow API Docs"');
        return res.status(401).send({ status: 401, message: 'Harap masukkan username dan password' });
    }
    res.status(err.statusCode || 500).send({
        status: err.statusCode || 500,
        message: err.message || 'Internal Server Error'
    })
})

fastify.ready(async(err) => {
    if (err){
        console.log('Ada kesalahan saat memuat fastify: ', err)
        process.exit(1)
    }

    try {
        const createTableUser = `
        CREATE TABLE IF NOT EXISTS user (
        id_user INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        instansi VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
        )
        `
        const createTableExam = `
        CREATE TABLE IF NOT EXISTS exam (
        id_exam INT AUTO_INCREMENT PRIMARY KEY,
        id_user INT NOT NULL,
        judul VARCHAR(255) NOT NULL,
        token VARCHAR(100) NOT NULL UNIQUE,
        link_form TEXT NOT NULL,
        createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_user) REFERENCES user(id_user) ON DELETE CASCADE
        )
        `;

        await fastify.mysql.query(createTableUser)
        await fastify.mysql.query(createTableExam)

        console.log('Database ready to use')

    } catch (error) {
        console.log('Ada kesalahan saat memuat database: ', error)
        process.exit(1)
    }

})

try {
    fastify.listen({ port: PORT }, ()=>{
        console.log(`Server is running on port http://localhost:${PORT}`)
    })
} catch (error) {
    console.log(error)
    process.exit(1)
}