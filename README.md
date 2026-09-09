# Inventário de Aparelhos

App em React (Vite) + Firebase para cadastro e controle de notebooks e tablets,
com login simples, lista/tabela, edição e exportação para Excel estilizado.

## Rodando localmente

```bash
npm install
cp .env.example .env   # depois preencha o .env com as chaves do SEU Firebase
npm run dev
```

---

## 1. Configurar o Firebase

1. Acesse https://console.firebase.google.com e clique em **Adicionar projeto**.
   Dê um nome (ex.: `inventario-aparelhos`) e conclua a criação.
2. Dentro do projeto, vá em **Build > Authentication > Get started** e ative o
   provedor **E-mail/senha**.
3. Ainda em Authentication, aba **Users**, clique em **Add user** e crie o(s)
   usuário(s) que vão logar no app (ex.: seu e-mail e uma senha). Como você não
   quer complicar segurança, não precisa de cadastro público — os usuários são
   criados manualmente aqui, só quem você adicionar consegue entrar.
4. Vá em **Build > Firestore Database > Create database**. Escolha o modo
   **produção** e a região mais próxima (ex.: `southamerica-east1`).
5. Na aba **Regras** do Firestore, cole o conteúdo do arquivo `firestore.rules`
   deste projeto e publique. Isso garante que **só usuários logados** conseguem
   ler ou escrever no banco — é isso que realmente protege seus dados, não a
   chave do app.
6. Volte em **Configurações do projeto** (ícone de engrenagem) > **Geral** >
   role até **Seus apps** > clique no ícone `</>` (Web) > registre um app
   (ex.: `web`). O Firebase vai te mostrar um bloco `firebaseConfig` com os
   valores `apiKey`, `authDomain`, `projectId`, etc.
7. Copie cada valor para o arquivo `.env` (baseado no `.env.example`):

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

   > O `.env` já está no `.gitignore` — ele nunca é enviado ao GitHub.
   > A chave `apiKey` do Firebase **não é secreta** por natureza (ela sempre
   > aparece no código do navegador), quem protege seu banco de fato são as
   > **regras do Firestore** do passo 5. Mesmo assim, mantemos tudo fora do
   > Git como boa prática e para facilitar trocar de projeto/ambiente.

## 2. Subir para o GitHub

```bash
cd device-inventory
git init
git add .
git commit -m "Primeiro commit - inventário de aparelhos"
```

1. Crie um repositório novo (vazio, sem README) em https://github.com/new.
2. Rode os comandos que o GitHub mostrar, algo como:

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

Antes de subir, confira com `git status` que o arquivo `.env` **não** aparece
na lista (ele deve estar ignorado). Só o `.env.example` (sem valores reais) vai
para o GitHub.

## 3. Publicar no Vercel

1. Acesse https://vercel.com, faça login e clique em **Add New… > Project**.
2. Importe o repositório do GitHub que você acabou de criar.
3. O Vercel detecta automaticamente que é um projeto Vite (Build Command:
   `npm run build`, Output Directory: `dist`).
4. Antes de clicar em Deploy, abra **Environment Variables** e adicione as
   mesmas 6 chaves do seu `.env`:

   | Name | Value |
   |---|---|
   | VITE_FIREBASE_API_KEY | (sua chave) |
   | VITE_FIREBASE_AUTH_DOMAIN | (seu domínio) |
   | VITE_FIREBASE_PROJECT_ID | (seu projeto) |
   | VITE_FIREBASE_STORAGE_BUCKET | (seu bucket) |
   | VITE_FIREBASE_MESSAGING_SENDER_ID | (seu sender id) |
   | VITE_FIREBASE_APP_ID | (seu app id) |

5. Clique em **Deploy**. Pronto — a cada `git push` na branch `main`, o Vercel
   publica uma nova versão automaticamente.
6. (Opcional, recomendado) No Firebase, em **Authentication > Settings >
   Authorized domains**, adicione o domínio que o Vercel te deu (ex.:
   `seu-projeto.vercel.app`), senão o login pode ser bloqueado em produção.

## Novidades desta versão

- **Tipo, Modelo, Funcionando, Sala**: agora são campos de texto com
  autocomplete (`datalist`) — sugerem valores já usados, mas aceitam texto
  novo. O campo **Sala** é obrigatório no cadastro e pode ser alterado a
  qualquer momento na edição do aparelho.
- **Ordenação da tabela**: clique no cabeçalho de Tipo, Modelo, Numeração ou
  Sala para ordenar crescente/decrescente.
- **Cadastro em lote** (`/lote`): defina Tipo, Modelo e Sala uma vez e
  adicione várias linhas só com Numeração e, se houver, o Problema.
- **Uso temporário** (`/uso`): registra empréstimos de aparelhos (dia, hora,
  professor, disciplina, quantidade, tipo/modelo, observação). Cada registro
  tem um botão **Devolver**; depois de devolvido, aparece a opção **Remover
  histórico** para limpar a lista.
- Nova coleção no Firestore: **`usageLogs`** (além de `devices`). A regra
  de segurança do `firestore.rules` já cobre as duas — não precisa mudar
  nada no console, só publicar o arquivo se ainda não publicou.

## Estrutura do projeto

```
src/
  firebase/config.js        -> inicializa o Firebase (lê o .env)
  context/AuthContext.jsx   -> estado de login (usuário atual, login, logout)
  components/
    Login.jsx               -> tela de login
    ProtectedRoute.jsx       -> bloqueia rota se não estiver logado
    DashboardHeader.jsx      -> contadores (total, notebooks, tablets, defeito)
    DeviceForm.jsx           -> cadastro de aparelho
    DeviceList.jsx           -> tabela com busca/filtro
    DeviceEditModal.jsx      -> editar/excluir um aparelho
    ExportButton.jsx         -> exporta a lista filtrada como .xlsx estilizado
  utils/
    deviceService.js         -> criar/editar/excluir aparelho no Firestore
    useDevices.js             -> escuta a coleção em tempo real
  pages/Home.jsx              -> página principal (junta tudo)
firestore.rules               -> regra de segurança (exige login)
```

## Regra de negócio do campo "Funcionando"

O campo é um texto livre. Se ficar **em branco**, o aparelho aparece como
"Funcionando". Se tiver **qualquer texto** (ex.: "tela quebrada", "não liga"),
o aparelho é contado como **com defeito** e esse texto aparece como a
descrição do problema na tabela e no Excel exportado.
