CREATE DATABASE IF NOT EXISTS melges_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE melges_database;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  phone VARCHAR(30) NULL,
  phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
  company VARCHAR(150) NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  session_version INT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS auth_codes (
  id CHAR(36) PRIMARY KEY,
  user_id INT NOT NULL,
  channel ENUM('email','phone') NOT NULL,
  code_hash CHAR(64) NOT NULL,
  attempts TINYINT NOT NULL DEFAULT 0,
  expires_at DATETIME NOT NULL,
  consumed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_auth_code_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_auth_codes_user (user_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS phases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL,
  order_index INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  phase_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  features TEXT NULL,
  approval_status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  progress_percent TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_project_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_project_phase FOREIGN KEY (phase_id) REFERENCES phases(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS project_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  recipient_user_id INT NOT NULL,
  message VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_notification_recipient FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_recipient (recipient_user_id, created_at)
) ENGINE=InnoDB;

INSERT IGNORE INTO categories (name, description) VALUES
  ('Site institucional', 'Site para apresentação de empresas e serviços'),
  ('Landing page', 'Página focada em conversão'),
  ('Loja virtual', 'E-commerce'),
  ('Portfólio', 'Apresentação de trabalhos'),
  ('Aplicação web', 'Sistema ou plataforma web');

INSERT IGNORE INTO phases (name, description, order_index) VALUES
  ('Em análise', 'Projeto recebido e aguardando avaliação da administração', 0),
  ('Briefing', 'Levantamento de objetivos e referências', 1),
  ('Design', 'Criação das telas e identidade visual', 2),
  ('Desenvolvimento', 'Implementação técnica do projeto', 3),
  ('Publicado', 'Projeto entregue e disponível', 4);
