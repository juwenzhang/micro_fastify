const execSqlState = {
    create_database: `
        CREATE DATABASE IF NOT EXISTS user_service;
    `,
    create_table: `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `,
    query_user_by_email: `
        SELECT * FROM user_service.users WHERE email = ?;
    `,
    insert_user: `
        INSERT INTO user_service.users (username, email, password) VALUES (?, ?, ?);
    `,
    query_user_by_id: `
        SELECT id, username, email, created_at as createdAt FROM user_service.users WHERE id = ?;
    `,
}

export default execSqlState