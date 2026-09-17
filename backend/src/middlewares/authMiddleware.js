export const verifyToken = async (req, res) => {
    try {
        await req.jwtVerify();
    } catch (err) {
        res.status(401).send({
            status: 401,
            message: 'Unauthorized! Token tidak valid atau kadaluarsa.'
        });
    }
};
