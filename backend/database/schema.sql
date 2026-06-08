CREATE DATABASE IF NOT EXISTS Ai_learning_assistant
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE ai_learning_assistant;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  avatar_url VARCHAR(500),
  status TINYINT NOT NULL DEFAULT 1 COMMENT '1=正常, 0=禁用',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL DEFAULT '新的会话',
  model VARCHAR(100) NOT NULL DEFAULT 'gpt-4.1-mini',
  system_prompt TEXT,
  is_archived TINYINT NOT NULL DEFAULT 0 COMMENT '1=已归档, 0=未归档',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_conversations_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  conversation_id BIGINT UNSIGNED NOT NULL,
  `role` ENUM('system', 'user', 'assistant') NOT NULL,
  content MEDIUMTEXT NOT NULL,
  model VARCHAR(100),
  prompt_tokens INT UNSIGNED DEFAULT 0,
  completion_tokens INT UNSIGNED DEFAULT 0,
  total_tokens INT UNSIGNED DEFAULT 0,
  status ENUM('streaming', 'completed', 'failed') NOT NULL DEFAULT 'completed',
  error_message TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_conversation_id
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

INSERT IGNORE INTO users (id, username, email)
VALUES (1, 'demo', 'demo@example.com');
