import ExamModel from '../models/Exam.js';

export const createExam = async (req, res) => {
    try {
        const data = { ...req.body, id_user: req.user.id_user };
        const result = await ExamModel.createExam(req.server, data);
        return res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        return res.status(500).send({
            status: 500,
            message: 'Internal Server Error'
        });
    }
};

export const getAllExam = async (req, res) => {
    try {
        const data = { id_user: req.user.id_user };
        const result = await ExamModel.getAllExam(req.server, data);
        return res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        return res.status(500).send({
            status: 500,
            message: 'Internal Server Error'
        });
    }
};

export const getExamByToken = async (req, res) => {
    try {
        const result = await ExamModel.getExamByToken(req.server, req.params);
        return res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        return res.status(500).send({
            status: 500,
            message: 'Internal Server Error'
        });
    }
};

export const updateExam = async (req, res) => {
    try {
        const data = { ...req.body, ...req.params };
        const result = await ExamModel.updateExam(req.server, data);
        return res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        return res.status(500).send({
            status: 500,
            message: 'Internal Server Error'
        });
    }
};

export const deleteExam = async (req, res) => {
    try {
        const result = await ExamModel.deleteExam(req.server, req.params);
        return res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        return res.status(500).send({
            status: 500,
            message: 'Internal Server Error'
        });
    }
};