-- ============================================
-- Add default postal worker for testing
-- ============================================

-- Insert default postal worker
-- Username: posta
-- Password: posta123
INSERT INTO postal_workers (username, password, full_name, phone) 
VALUES ('posta', 'posta123', 'Postari Testues', '+383 44 000 000')
ON CONFLICT (username) DO NOTHING;

COMMIT;
