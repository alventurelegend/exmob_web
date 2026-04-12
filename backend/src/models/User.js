const UserModel = {
    register: async (fastify, data) => {
        const {full_name, instansi, username, password} = data

        const [rows] = await fastify.mysql.query('SELECT * FROM user WHERE username = ?', [username])
        if (rows.length > 0) {
            return {
                status: 400,
                message: 'Username already exists'
            }
        }

        const [result] = await fastify.mysql.query('INSERT INTO user (full_name, instansi, username, password) VALUES (?, ?, ?, ?)', [full_name, instansi, username, password])
        return {
            status: 200,
            message: 'User registered successfully',
            data: result
        }
    },
    login: async (fastify, data) => {
        const {username, password} = data

        const [rows] = await fastify.mysql.query('SELECT * FROM user WHERE username = ?', [username])
        if (rows.length === 0) {
            return {
                status: 404,
                message: 'User not found'
            }
        }

        const user = rows[0]
        if (user.password !== password) {
            return {
                status: 401,
                message: 'Invalid password'
            }
        }

        // Buat payload untuk disimpan di dalam token JWT nya
        // Disini kita ga nyimpen password nya ya buat keamanan
        const payload = {
            id_user: user.id_user,
            username: user.username,
            full_name: user.full_name,
            instansi: user.instansi
        }

        // Proses pembuatan (sign) token menggunakan data payload di atas
        const token = fastify.jwt.sign(payload, {
            expiresIn: '1h'
        })

        return {
            status: 200,
            message: 'User logged in successfully',
            data: {
                user: payload,
                token: token
            }
        }
    }
}

export default UserModel;