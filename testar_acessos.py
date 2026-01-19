from app import app, db, Usuario
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    
    # 1. CRIANDO O ADMINISTRADOR
    if not Usuario.query.filter_by(cpf="11111111111").first():
        admin = Usuario(
            nome="Chefe Administrativo",
            cpf="11111111111",
            senha=generate_password_hash("admin123"),
            cargo="Admin"
        )
        db.session.add(admin)

    # 2. CRIANDO O MOTORISTA
    if not Usuario.query.filter_by(cpf="22222222222").first():
        motorista = Usuario(
            nome="Motorista Silva",
            cpf="22222222222",
            senha=generate_password_hash("moto123"),
            cargo="Motorista"
        )
        db.session.add(motorista)
    
    db.session.commit()
    print("Usuários de teste criados!")