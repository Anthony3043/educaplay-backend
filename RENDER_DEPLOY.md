# Deploy do EducaPlay Backend no Render

## Pré-requisitos
- Conta no [Render](https://render.com)
- Banco de dados no [Supabase](https://supabase.com) (já configurado)

## Passo a passo

### 1. Suba o código para o GitHub
Certifique-se de que o `.gitignore` exclui `.env` e `node_modules`.

### 2. Crie um Web Service no Render
- New → **Web Service**
- Conecte seu repositório GitHub
- Configurações:
  - **Name:** `educaplay-backend`
  - **Environment:** `Node`
  - **Build Command:** `npm install && prisma generate && prisma migrate deploy`
  - **Start Command:** `node server.js`

### 3. Defina as variáveis de ambiente no Render
No painel do serviço → **Environment** → adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:[SENHA]@db.[ID].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | `postgresql://postgres:[SENHA]@db.[ID].supabase.co:5432/postgres` |
| `JWT_SECRET` | Chave aleatória forte (ex: gere com `openssl rand -hex 32`) |
| `JWT_EXPIRES_IN` | `7d` |
| `EMAIL_USER` | Seu Gmail |
| `EMAIL_PASS` | Senha de App do Gmail (não a senha normal) |
| `EMAIL_FROM` | `EducaPlay <seu-email@gmail.com>` |
| `BASE_URL` | `https://educaplay-backend.onrender.com` (URL que o Render gera) |

> ⚠️ **IMPORTANTE:** Não coloque `PORT` — o Render define automaticamente.

### 4. Como obter o DIRECT_URL do Supabase
No Supabase → Settings → Database:
- **Transaction pooler (porta 6543)** → use no `DATABASE_URL` (com `?pgbouncer=true`)
- **Direct connection (porta 5432)** → use no `DIRECT_URL`

### 5. Após o deploy
Copie a URL do seu serviço (ex: `https://educaplay-backend.onrender.com`)
e configure no frontend em `EXPO_PUBLIC_API_URL`.

### 6. Verifique o health check
Acesse `https://educaplay-backend.onrender.com/` — deve retornar:
```json
{ "status": "EducaPlay API rodando ✅" }
```

## Senha de App do Gmail
1. Ative a verificação em 2 etapas na sua conta Google
2. Acesse: myaccount.google.com → Segurança → Senhas de app
3. Crie uma senha para "EducaPlay"
4. Use os 16 caracteres gerados no `EMAIL_PASS`
