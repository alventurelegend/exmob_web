export const verifyToken = async (req, res) => {
    try {
        // Disini 'satpam' (jwtVerify) ngecek, Tokennya ada ga? Valid ga?
        await req.jwtVerify(); 
    } catch (err) {
        // Kalo token bodong, expired, atau ga bawa token, otomatis ketendang kesini
        res.status(401).send({ status: 401, message: 'Unauthorized! Token tidak valid atau kadaluarsa.' });
    }
};
