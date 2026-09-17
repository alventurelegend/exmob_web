const CREATE_USER_TABLE = `
CREATE TABLE IF NOT EXISTS user (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    instansi VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
`;

const CREATE_EXAM_TABLE = `
CREATE TABLE IF NOT EXISTS exam (
    id_exam INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    token VARCHAR(100) NOT NULL UNIQUE,
    link_form TEXT NOT NULL,
    createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES user(id_user) ON DELETE CASCADE
);
`;

export async function initDatabase(fastify) {
    await fastify.mysql.query(CREATE_USER_TABLE);
    await fastify.mysql.query(CREATE_EXAM_TABLE);
    console.log('Database ready to use');
}
