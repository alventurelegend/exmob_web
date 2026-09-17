import { register, login } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import {
    createExam,
    getAllExam,
    getExamByToken,
    updateExam,
    deleteExam
} from '../controllers/examController.js';

const genericResponse = {
    type: 'object',
    properties: {
        status: { type: 'number' },
        message: { type: 'string' }
    }
};

const loginSuccessResponse = {
    type: 'object',
    properties: {
        status: { type: 'number' },
        message: { type: 'string' },
        data: {
            type: 'object',
            properties: {
                id_user: { type: 'number' },
                full_name: { type: 'string' },
                instansi: { type: 'string' },
                username: { type: 'string' },
                token: { type: 'string' }
            }
        }
    }
};

const createExamSuccessResponse = {
    type: 'object',
    properties: {
        status: { type: 'number' },
        message: { type: 'string' },
        data: {
            type: 'object',
            properties: {
                token: { type: 'string' }
            }
        }
    }
};

const getAllExamSuccessResponse = {
    type: 'object',
    properties: {
        status: { type: 'number' },
        message: { type: 'string' },
        data: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id_exam: { type: 'number' },
                    id_user: { type: 'number' },
                    judul: { type: 'string' },
                    token: { type: 'string' },
                    link_form: { type: 'string' },
                    createAt: { type: 'string', format: 'date-time' }
                }
            }
        }
    }
};

const examDetailSuccessResponse = {
    type: 'object',
    properties: {
        status: { type: 'number' },
        message: { type: 'string' },
        data: {
            type: 'object',
            properties: {
                id_exam: { type: 'number' },
                id_user: { type: 'number' },
                judul: { type: 'string' },
                token: { type: 'string' },
                link_form: { type: 'string' },
                createAt: { type: 'string', format: 'date-time' },
                guru_name: { type: 'string' },
                guru_instansi: { type: 'string' }
            }
        }
    }
};

export default function routes(fastify, options, done) {
    fastify.get('/api', {
        schema: {
            description: 'Mengecek status API',
            tags: ['System'],
            response: {
                200: genericResponse
            }
        }
    }, (req, res) => {
        res.status(200).send({
            status: 200,
            message: 'Api Is Running'
        });
    });

    fastify.post('/api/register', {
        schema: {
            description: 'Mendaftar akun baru',
            tags: ['Auth'],
            body: {
                type: 'object',
                required: ['full_name', 'instansi', 'username', 'password'],
                properties: {
                    full_name: { type: 'string' },
                    instansi: { type: 'string' },
                    username: { type: 'string' },
                    password: { type: 'string' }
                }
            },
            response: {
                200: genericResponse,
                400: genericResponse,
                500: genericResponse
            }
        }
    }, register);

    fastify.post('/api/login', {
        schema: {
            description: 'Login ke dalam sistem',
            tags: ['Auth'],
            body: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' }
                }
            },
            response: {
                200: loginSuccessResponse,
                400: genericResponse,
                500: genericResponse
            }
        }
    }, login);

    fastify.post('/api/exam', {
        onRequest: [verifyToken],
        schema: {
            description: 'Membuat ruang ujian baru',
            tags: ['Exam'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['judul', 'link_form'],
                properties: {
                    judul: { type: 'string' },
                    link_form: { type: 'string' }
                }
            },
            response: {
                200: createExamSuccessResponse,
                400: genericResponse,
                401: genericResponse,
                500: genericResponse
            }
        }
    }, createExam);

    fastify.get('/api/exam', {
        onRequest: [verifyToken],
        schema: {
            description: 'Mendapat daftar semua ruang ujian milik user',
            tags: ['Exam'],
            security: [{ bearerAuth: [] }],
            response: {
                200: getAllExamSuccessResponse,
                401: genericResponse,
                500: genericResponse
            }
        }
    }, getAllExam);

    fastify.get('/api/exam/:token', {
        schema: {
            description: 'Mencari detil ujian berdasarkan token. Endpoint publik digunakan aplikasi Android setelah scan QR code.',
            tags: ['Exam (Publik)'],
            params: {
                type: 'object',
                properties: {
                    token: { type: 'string' }
                }
            },
            response: {
                200: examDetailSuccessResponse,
                401: genericResponse,
                404: genericResponse,
                500: genericResponse
            }
        }
    }, getExamByToken);

    fastify.put('/api/exam/:id_exam', {
        onRequest: [verifyToken],
        schema: {
            description: 'Mengubah judul atau link ujian',
            tags: ['Exam'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id_exam'],
                properties: {
                    id_exam: { type: 'string' }
                }
            },
            body: {
                type: 'object',
                required: ['judul', 'link_form'],
                properties: {
                    judul: { type: 'string' },
                    link_form: { type: 'string' }
                }
            },
            response: {
                200: genericResponse,
                400: genericResponse,
                401: genericResponse,
                404: genericResponse,
                500: genericResponse
            }
        }
    }, updateExam);

    fastify.delete('/api/exam/:id_exam', {
        onRequest: [verifyToken],
        schema: {
            description: 'Menghapus ruang ujian',
            tags: ['Exam'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id_exam'],
                properties: {
                    id_exam: { type: 'string' }
                }
            },
            response: {
                200: genericResponse,
                400: genericResponse,
                401: genericResponse,
                500: genericResponse
            }
        }
    }, deleteExam);

    done();
}