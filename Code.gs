/**
 * Sistema de Avaliação Automatizada com IA e Google Forms
 * Backend - Google Apps Script (Code.gs)
 */

// Servir a interface web principal
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Gerador de Provas IA & Dashboard')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ==========================================
// 1. AUTENTICAÇÃO E CONFIGURAÇÃO
// ==========================================

/**
 * Verifica se a senha inserida é correta.
 * Se nenhuma senha estiver cadastrada, a padrão é 'multiplicadora123'.
 */
function checkPassword(enteredPassword) {
  var props = PropertiesService.getScriptProperties();
  var savedPassword = props.getProperty('APP_PASSWORD');
  if (!savedPassword) {
    // Primeira execução ou senha limpa
    return enteredPassword === 'multiplicadora123';
  }
  return enteredPassword === savedPassword;
}

/**
 * Altera a senha de acesso da aplicação.
 */
function setAppPassword(currentPassword, newPassword) {
  var props = PropertiesService.getScriptProperties();
  var savedPassword = props.getProperty('APP_PASSWORD') || 'multiplicadora123';
  
  if (currentPassword !== savedPassword) {
    throw new Error('A senha atual inserida está incorreta.');
  }
  
  if (!newPassword || newPassword.trim().length < 4) {
    throw new Error('A nova senha deve ter no mínimo 4 caracteres.');
  }
  
  props.setProperty('APP_PASSWORD', newPassword.trim());
  return true;
}

/**
 * Salva a Chave de API do Gemini nas propriedades do script.
 */
function saveGeminiKey(key) {
  if (!key) {
    throw new Error('A chave de API não pode estar vazia.');
  }
  var props = PropertiesService.getScriptProperties();
  props.setProperty('GEMINI_API_KEY', key.trim());
  return true;
}

/**
 * Retorna a chave do Gemini mascarada (ex: AIza...3fB) ou vazia se não configurada.
 */
function getGeminiKey() {
  var props = PropertiesService.getScriptProperties();
  var key = props.getProperty('GEMINI_API_KEY') || '';
  if (key) {
    if (key.length > 8) {
      return key.substring(0, 4) + '...' + key.substring(key.length - 4);
    }
    return 'Configurada';
  }
  return '';
}

// ==========================================
// 2. GERAÇÃO DE PERGUNTAS COM GEMINI
// ==========================================

/**
 * Chama a API do Gemini 1.5 Flash para gerar perguntas com base no conteúdo
 * retornando uma lista estruturada em JSON.
 */
function generateQuizQuestions(content, numQuestions) {
  var props = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('Chave de API do Gemini não configurada. Por favor, acesse a aba "Configurações" e insira sua chave.');
  }

  if (!content || content.trim().length < 50) {
    throw new Error('O conteúdo fornecido é muito curto. Insira pelo menos 50 caracteres do treinamento.');
  }

  var systemInstruction = 
    "Você é um especialista em educação corporativa e treinamento profissional. " +
    "Seu objetivo é criar perguntas de avaliação de aprendizado a partir de um texto de treinamento. " +
    "Crie perguntas objetivas, claras, de múltipla escolha, focadas em validar a retenção de conceitos importantes. " +
    "Evite pegadinhas ou ambiguidades. Cada pergunta deve focar apenas no conteúdo do texto.";

  var prompt = 
    "Com base no conteúdo de treinamento fornecido, gere exatamente " + numQuestions + " perguntas de múltipla escolha para testar o aprendizado. " +
    "Cada pergunta deve ter exatamente entre 4 e 5 alternativas, sendo apenas uma alternativa correta.\n\n" +
    "Conteúdo do Treinamento:\n" + content;

  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;

  var payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    systemInstruction: {
      parts: [{
        text: systemInstruction
      }]
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          questions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                questionText: { type: "STRING" },
                choices: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                correctChoiceIndex: { type: "INTEGER" },
                explanation: { type: "STRING" }
              },
              required: ["questionText", "choices", "correctChoiceIndex", "explanation"]
            }
          }
        },
        required: ["questions"]
      }
    }
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var responseCode = response.getResponseCode();
  var responseText = response.getContentText();

  if (responseCode !== 200) {
    Logger.log('Erro do Gemini API: ' + responseText);
    var errMsg = 'Erro na API do Gemini. ';
    try {
      var errJson = JSON.parse(responseText);
      if (errJson.error && errJson.error.message) {
        errMsg += errJson.error.message;
      }
    } catch(e) {}
    throw new Error(errMsg);
  }

  var json = JSON.parse(responseText);
  var textResult = json.candidates[0].content.parts[0].text;
  var parsedResult = JSON.parse(textResult);

  if (!parsedResult.questions || parsedResult.questions.length === 0) {
    throw new Error('Nenhuma pergunta foi gerada pela inteligência artificial.');
  }

  return parsedResult.questions;
}

// ==========================================
// 3. CRIAÇÃO DO FORMULÁRIO GOOGLE FORMS
// ==========================================

/**
 * Cria o Quiz no Google Forms com gabarito baseado nas perguntas geradas.
 */
function createFormQuiz(title, questions) {
  try {
    // 1. Criar o formulário
    var form = FormApp.create(title);
    form.setIsQuiz(true);
    form.setAllowResponseEdits(false);
    form.setLimitOneResponsePerUser(false); // Permite responder sem login obrigatório Google
    form.setCollectEmail(false);
    form.setShowLinkToRespondAgain(false);
    
    // Adiciona uma descrição bonita
    form.setDescription("Esta avaliação mede a absorção do conteúdo do treinamento. Por favor, responda com atenção.");

    // 2. Adicionar pergunta de Identificação (Nome)
    var nameItem = form.addTextItem();
    nameItem.setTitle('Qual é o seu nome completo?');
    nameItem.setRequired(true);

    // 3. Adicionar as perguntas do Quiz
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      var mcItem = form.addMultipleChoiceItem();
      mcItem.setTitle((i + 1) + ". " + q.questionText);
      mcItem.setRequired(true);
      mcItem.setPoints(10); // 10 pontos por questão

      var choices = [];
      for (var j = 0; j < q.choices.length; j++) {
        var isCorrect = (j === q.correctChoiceIndex);
        choices.push(mcItem.createChoice(q.choices[j], isCorrect));
      }
      mcItem.setChoices(choices);

      // Adiciona o feedback/gabarito se houver explicação
      if (q.explanation) {
        var feedback = FormApp.createFeedback()
            .setText(q.explanation)
            .build();
        mcItem.setFeedbackForIncorrectAnswers(feedback);
        mcItem.setFeedbackForCorrectAnswers(feedback);
      }
    }

    var formId = form.getId();
    var publishedUrl = form.getPublishedUrl();
    var editUrl = form.getEditUrl();

    // 4. Registrar o formulário nas propriedades locais
    registerForm(formId, title, publishedUrl, editUrl, questions.length);

    return {
      formId: formId,
      publishedUrl: publishedUrl,
      editUrl: editUrl,
      title: title,
      questionCount: questions.length
    };
  } catch (e) {
    Logger.log('Erro ao criar formulário: ' + e.message);
    throw new Error('Falha ao criar o formulário no seu Google Drive: ' + e.message);
  }
}

// ==========================================
// 4. PERSISTÊNCIA DAS AVALIAÇÕES CRIADAS
// ==========================================

/**
 * Salva os metadados do formulário criado na lista do usuário
 */
function registerForm(formId, title, publishedUrl, editUrl, questionCount) {
  var props = PropertiesService.getScriptProperties();
  var formsJson = props.getProperty('CREATED_FORMS') || '[]';
  var forms = JSON.parse(formsJson);

  forms.unshift({
    id: formId,
    title: title,
    publishedUrl: publishedUrl,
    editUrl: editUrl,
    questionCount: questionCount,
    createdAt: new Date().toISOString()
  });

  // Limita o histórico das últimas 50 avaliações para não estourar cota de dados
  if (forms.length > 50) {
    forms = forms.slice(0, 50);
  }

  props.setProperty('CREATED_FORMS', JSON.stringify(forms));
}

/**
 * Retorna as avaliações salvas, validando se ainda existem no Google Drive do usuário.
 */
function getActiveForms() {
  var props = PropertiesService.getScriptProperties();
  var formsJson = props.getProperty('CREATED_FORMS') || '[]';
  var forms = JSON.parse(formsJson);
  var validForms = [];

  for (var i = 0; i < forms.length; i++) {
    try {
      // Tenta abrir o formulário para garantir que existe
      FormApp.openById(forms[i].id);
      validForms.push(forms[i]);
    } catch (e) {
      // Ignora formulários excluídos no Drive
      Logger.log('Formulário excluído detectado: ' + forms[i].id);
    }
  }

  // Atualiza a lista se algum item foi limpo
  if (validForms.length !== forms.length) {
    props.setProperty('CREATED_FORMS', JSON.stringify(validForms));
  }

  return validForms;
}

/**
 * Remove uma avaliação apenas do histórico do painel (não exclui do Drive).
 */
function deleteFormFromList(formId) {
  var props = PropertiesService.getScriptProperties();
  var formsJson = props.getProperty('CREATED_FORMS') || '[]';
  var forms = JSON.parse(formsJson);

  var filteredForms = forms.filter(function(f) {
    return f.id !== formId;
  });

  props.setProperty('CREATED_FORMS', JSON.stringify(filteredForms));
  return true;
}

// ==========================================
// 5. ACOMPANHAMENTO DE NOTAS EM TEMPO REAL
// ==========================================

/**
 * Lê todas as respostas enviadas para um formulário específico e formata os resultados.
 */
function getFormSubmissions(formId) {
  try {
    var form = FormApp.openById(formId);
    var responses = form.getResponses();
    var submissions = [];

    // Calcular pontuação máxima
    var items = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE);
    var totalPossible = 0;
    for (var i = 0; i < items.length; i++) {
      totalPossible += items[i].asMultipleChoiceItem().getPoints();
    }

    for (var r = 0; r < responses.length; r++) {
      var resp = responses[r];
      var email = resp.getRespondentEmail() || 'Não cadastrado';
      var timestamp = resp.getTimestamp();
      var itemResponses = resp.getItemResponses();

      // O primeiro item do form é o Nome Completo
      var name = 'Anônimo';
      if (itemResponses.length > 0) {
        var firstTitle = itemResponses[0].getItem().getTitle().toLowerCase();
        if (firstTitle.indexOf('nome') !== -1 || firstTitle.indexOf('completo') !== -1) {
          name = itemResponses[0].getResponse();
        }
      }

      // Somar pontuação do quiz
      var score = 0;
      var gradableResponses = resp.getGradableItemResponses();
      for (var g = 0; g < gradableResponses.length; g++) {
        var gScore = gradableResponses[g].getScore();
        if (gScore !== null) {
          score += gScore;
        }
      }

      submissions.push({
        name: name,
        email: email,
        timestamp: timestamp.toISOString(),
        score: score,
        totalPossible: totalPossible,
        percentage: totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0
      });
    }

    // Ordena do mais recente para o mais antigo
    submissions.sort(function(a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return {
      title: form.getTitle(),
      submissions: submissions,
      totalPossible: totalPossible
    };
  } catch (e) {
    Logger.log('Erro ao ler submissões: ' + e.message);
    throw new Error('Falha ao obter respostas. Verifique se o formulário ainda existe. Detalhes: ' + e.message);
  }
}
