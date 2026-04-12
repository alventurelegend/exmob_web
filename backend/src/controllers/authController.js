import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        const fastify = req.server; // mengambil instance fastify dari request
        const data = req.body;
        const result = await UserModel.register(fastify, data);
        res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
};

export const login = async (req, res) => {
    try {
        const fastify = req.server;
        const data = req.body;
        const result = await UserModel.login(fastify, data);
        res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
};
