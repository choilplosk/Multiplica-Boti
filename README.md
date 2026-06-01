# Sistema de Avaliação de Treinamento Automatizado (IA & Google Forms)

Este repositório contém os códigos-fonte para implantar um sistema web completo que permite à multiplicadora de treinamentos gerar avaliações de múltipla escolha com inteligência artificial, publicá-las automaticamente no Google Forms, enviá-las pelo WhatsApp e acompanhar os resultados dos candidatos em tempo real através de um painel elegante.

O projeto é desenvolvido para o **Google Apps Script**, o que elimina custos de servidor e hospedagem, além de rodar nativamente dentro do ecossistema Google Workspace da multiplicadora de forma 100% segura.

---

## 📂 Estrutura de Arquivos

*   `Code.gs` - Arquivo de backend do Google Apps Script (lógicas de IA, integração com a API do Forms e recuperação de respostas).
*   `Index.html` - Interface Web em HTML, CSS (design premium com glassmorphism e tema escuro) e JavaScript (interações assíncronas via `google.script.run`).

---

## 🔒 Como Restringir o Acesso (Segurança)

Por padrão, a aplicação possui uma **tela de login e senha própria integrada**.
*   **Senha padrão:** `multiplicadora123` (você pode alterar a senha a qualquer momento na aba **Configurações** do painel).
*   **Como funciona:** O painel pode ser implantado para acesso público, mas exige que qualquer usuário digite a senha correta para liberar o uso das abas de geração e do dashboard de notas.

---

## 🚀 Passo a Passo para Implantação no Google Apps Script

### 1. Criar o Projeto no Google
1.  Acesse o [Google Apps Script Dashboard](https://script.google.com) usando a sua conta Google corporativa ou pessoal.
2.  Clique no botão **Novo projeto** (New Project) no canto superior esquerdo.
3.  Renomeie o projeto para algo como: `Multiplicadora AI - Avaliação`.

### 2. Copiar os Códigos
1.  Por padrão, o projeto virá com um arquivo chamado `Código.gs` (ou `Code.gs`).
2.  Abra o arquivo `Code.gs` deste repositório, copie todo o código e cole-o no editor de código do Google, substituindo o que estiver lá. Salve (Ctrl + S).
3.  No painel do Apps Script, clique no botão **+** (ao lado de Arquivos) e escolha a opção **HTML**.
4.  Nomeie o arquivo como `Index` (o Google criará automaticamente como `Index.html`).
5.  Abra o arquivo `Index.html` deste repositório, copie todo o conteúdo e cole-o no arquivo que você acabou de criar no Google. Salve (Ctrl + S).

### 3. Fazer o Deploy (Publicar a Aplicação)
1.  No canto superior direito da tela do Apps Script, clique no botão azul **Implantar** (Deploy) e escolha **Nova implantação** (New deployment).
2.  Clique no ícone de engrenagem (Tipo de implantação) e selecione **App da Web** (Web app).
3.  Preencha as configurações conforme abaixo:
    *   **Descrição:** Primeira Versão
    *   **Executar como (Execute as):** Eu (sua conta Google) - *Isso é necessário para que a IA possa criar os formulários na sua conta do Drive*.
    *   **Quem tem acesso (Who has access):** Qualquer pessoa (Anyone) - *Permite que você use a tela de senha e acesse de qualquer navegador ou celular*.
4.  Clique no botão azul **Implantar** (Deploy).
5.  **Importante:** Na primeira vez, o Google solicitará que você autorize as permissões. Clique em **Autorizar acesso**, selecione a sua conta Google, clique em **Avançado** (Advanced) no canto inferior esquerdo e depois clique em **Ir para Multiplicadora AI (não seguro)** (Go to... unsafe). Permita os acessos de Forms, Drive e Conectividade Externa.
6.  O Google exibirá uma tela com o **URL do app da Web**. **Copie este link!** Esse é o link do seu painel administrativo.

---

## 🤖 Como Obter e Configurar a Chave do Gemini (API Key)

Para que a inteligência artificial do sistema funcione, você precisa de uma chave do Google Gemini:

1.  Acesse o [Google AI Studio](https://aistudio.google.com/).
2.  Entre com a sua conta Google.
3.  Clique no botão azul **Get API key** (Obter chave de API).
4.  Clique em **Create API key** (Criar chave de API) e selecione o projeto.
5.  Copie a chave gerada (ela começa com `AIzaSy...`).
6.  Abra o link do seu **Web App do Google Apps Script** que você copiou no passo anterior.
7.  Digite a senha de login (`multiplicadora123`), acesse a aba **Configurações** (engrenagem).
8.  Cole a chave do Gemini no campo indicado e clique em **Salvar Chave API**. Pronto! O sistema está ativo.

---

## 📲 Como Usar no Dia a Dia

1.  **Acesse o Painel:** Abra o link do seu Web App no computador ou celular e insira a senha.
2.  **Gere as Questões:**
    *   Insira um título para a prova (ex: *Treinamento de Vendas - Mod. 1*).
    *   Escolha a quantidade de perguntas (10, 12 ou 15) e a nota de corte (ex: 70% de acerto).
    *   Cole o conteúdo de treinamento na caixa de texto.
    *   Clique em **Criar Formulário com IA**.
3.  **Envie aos Candidatos:**
    *   Em poucos segundos a IA criará o formulário. Copie o link exibido ou clique em **Enviar via WhatsApp** para mandar no grupo dos consultores imediatamente.
4.  **Monitore as Notas em Tempo Real:**
    *   Acesse a aba **Histórico & Notas**.
    *   Selecione a avaliação gerada na lista lateral.
    *   Você verá a lista de quem já respondeu, a pontuação obtida e alertas visuais automáticos:
        *   🟢 **Aprovado:** Candidatos que superaram a nota de corte.
        *   🟡 **Alerta:** Candidatos limítrofes.
        *   🔴 **Recuperação:** Notas abaixo da média (sinal vermelho para você "segurar" e reorientar o consultor).
    *   Clique em **Atualizar Notas** para puxar novas respostas instantaneamente.

---

## 🐙 Como Salvar no seu GitHub

Para manter um backup seguro e versionado na sua conta do GitHub:

1.  Acesse o [GitHub](https://github.com/) e faça login.
2.  Clique em **New** para criar um novo repositório.
3.  Dê um nome para o repositório (ex: `multiplicadora-ai-evaluator`) e selecione a opção **Private** (Privado) se quiser ocultar o código de terceiros.
4.  Inicialize o repositório e faça o upload destes arquivos (`Code.gs`, `Index.html` e este `README.md`).
5.  Caso queira usar Git localmente para fazer o envio via prompt:
    ```bash
    git init
    git add .
    git commit -m "Versao Inicial multiplicadora-ai"
    git branch -M main
    git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
    git push -u origin main
    ```
