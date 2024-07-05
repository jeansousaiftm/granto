# GRANTO AI
MVP para extração de informações baseado em contratos para a Granto Seguros.

## Pré-requisitos
Certifique-se de ter o Python instalado. Este projeto foi testado com a versão 3.12.4 do Python.

## Instalação
Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Clonar o repositório
```
git clone https://github.com/jeansousaiftm/granto.git
cd granto
```

### 2. Instalar dependências
Certifique-se de estar no diretório raiz do projeto e execute o comando abaixo para instalar todas as dependências necessárias:

```
pip install -r requirements.txt
```

### 3. Instalar o modelo de dados
Modelo usado para extração das caracterísitcas

```
python -m spacy download en_core_web_sm
```

### 4. Executar o backend
Certifique-se de estar no diretório raiz do projeto e execute o script principal:

```
python ./backend/main.py
```

### 5. Acessar no navegador
Abra seu navegador e acesse a URL abaixo:

```
http://localhost:5000
(Onde 5000 é a porta padrão)
```

Se precisar de mais informações ou ajuda, consulte a documentação ou abra uma issue no repositório.