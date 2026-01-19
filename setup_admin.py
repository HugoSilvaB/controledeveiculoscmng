from app import app, db, Usuario
from werkzeug.security import generate_password_hash

with app.app_context():
    # Aqui você define o seu login de acesso
    admin = Usuario(
        nome="Administrador Câmara",
        cpf="05709971197",  # <--- ESTE SERÁ SEU LOGIN
        senha=generate_password_hash("hugo181320"), # <--- ESTA SERÁ SUA SENHA
        cargo="Admin"
    )
    db.session.add(admin)
    db.session.commit()
    print("Sucesso! Logue com CPF: 05709971197 e Senha: hugo181320")