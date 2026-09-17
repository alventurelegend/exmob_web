import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        const result = await UserModel.register(req.server, req.body);
        return res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        return res.status(500).send({
            status: 500,
            message: 'Internal Server Error'
        });
    }
};

export const login = async (req, res) => {
    try {
        const result = await UserModel.login(req.server, req.body);
        return res.status(result.status).send(result);
    } catch (error) {
        req.server.log.error(error);
        return res.status(500).send({
            status: 500,
            message: 'Internal Server Error'
        });
    }
};
