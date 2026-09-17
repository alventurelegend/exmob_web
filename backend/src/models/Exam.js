import CryptoJS from 'crypto-js';
import { config } from '../config/index.js';

const generateExamToken = () => {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `EXAM-${randomString}`;
};

const encryptLinkForm = (text) => {
    if (!text) return text;
    const secret = config.jwt.secret || '';
    const key = CryptoJS.enc.Utf8.parse(secret.slice(0, 32).padEnd(32, '0'));
    const iv = CryptoJS.enc.Utf8.parse(secret.slice(0, 16).padEnd(16, '0'));

    return CryptoJS.AES.encrypt(text, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
};

const ExamModel = {
    createExam: async (fastify, data) => {
        const { id_user, judul, link_form } = data;

        if (!judul || judul.trim() === '') {
            return { status: 400, message: 'Judul ujian wajib diisi' };
        }

        const token = generateExamToken();

        const [existing] = await fastify.mysql.query(
            'SELECT id_exam FROM exam WHERE token = ?',
            [token]
        );

        if (existing.length > 0) {
            return {
                status: 400,
                message: 'Token already exists'
            };
        }

        const [result] = await fastify.mysql.query(
            'INSERT INTO exam (id_user, judul, token, link_form) VALUES (?, ?, ?, ?)',
            [id_user, judul, token, link_form]
        );

        return {
            status: 200,
            message: 'Exam created successfully',
            data: {
                id_exam: result.insertId,
                id_user,
                judul,
                token,
                link_form
            }
        };
    },

    getAllExam: async (fastify, data) => {
        const { id_user } = data;

        const [rows] = await fastify.mysql.query(
            'SELECT * FROM exam WHERE id_user = ?',
            [id_user]
        );

        return {
            status: 200,
            message: 'Exam retrieved successfully',
            data: rows
        };
    },

    getExamByToken: async (fastify, data) => {
        const { token } = data;

        const [rows] = await fastify.mysql.query(
            `SELECT e.id_exam, e.id_user, e.judul, e.token, e.link_form, e.createAt,
                    u.full_name AS guru_name, u.instansi AS guru_instansi
             FROM exam e
             JOIN user u ON e.id_user = u.id_user
             WHERE e.token = ?`,
            [token]
        );

        if (rows.length === 0) {
            return {
                status: 404,
                message: 'Token tidak ditemukan'
            };
        }

        if (rows[0].link_form) {
            rows[0].link_form = encryptLinkForm(rows[0].link_form);
        }

        return {
            status: 200,
            message: 'Exam retrieved successfully',
            data: rows[0]
        };
    },

    updateExam: async (fastify, data) => {
        const { id_exam, judul, link_form } = data;

        const [rows] = await fastify.mysql.query(
            'UPDATE exam SET judul = ?, link_form = ? WHERE id_exam = ?',
            [judul, link_form, id_exam]
        );

        return {
            status: 200,
            message: 'Exam updated successfully',
            data: rows
        };
    },

    deleteExam: async (fastify, data) => {
        const { id_exam } = data;

        const [rows] = await fastify.mysql.query(
            'DELETE FROM exam WHERE id_exam = ?',
            [id_exam]
        );

        return {
            status: 200,
            message: 'Exam deleted successfully',
            data: rows
        };
    }
};

export default ExamModel;
