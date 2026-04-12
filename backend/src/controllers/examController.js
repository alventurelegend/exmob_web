import ExamModel from "../models/Exam.js";

export const createExam = async (req, res) => {
    try {
        const fastify = req.server;
        // Gabungkan data dari body dan tambahkan id_user dari token (req.user)
        const data = { ...req.body, id_user: req.user.id_user };
        const result = await ExamModel.createExam(fastify, data);
        res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
}

export const getAllExam = async (req, res) => {
    try {
        const fastify = req.server;
        // Ambil id_user langsung dari token JWT (req.user), abaikan data body dari user
        const data = { id_user: req.user.id_user };
        const result = await ExamModel.getAllExam(fastify, data);
        res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
}

export const getExamByToken = async (req, res) => {
    try {
        const fastify = req.server;
        const data = req.params; // getting token from URL params
        const result = await ExamModel.getExamByToken(fastify, data);
        res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
}

export const updateExam = async (req, res) => {
    try {
        const fastify = req.server;
        const data = { ...req.body, ...req.params }; // merge body and params to get link_form and id_exam
        const result = await ExamModel.updateExam(fastify, data);
        res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
}

export const deleteExam = async (req, res) => {
    try {
        const fastify = req.server;
        const data = req.params; // getting id_exam from URL params
        const result = await ExamModel.deleteExam(fastify, data);
        res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
}