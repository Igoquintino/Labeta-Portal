# Roteiro Estratégico: Implementação de Persistência e CRUD com Supabase

Este documento estabelece o plano de ação técnico para converter a interface administrativa estática do portal LABETA em um sistema com persistência real em banco de dados PostgreSQL (via Supabase), garantindo sincronização reativa e tolerância a falhas via dados locais de contingência (*fallback*).

---

## 1. Diagnóstico do Estado Atual

* **Consumo Estático Invariável:** Os componentes de visualização (`News.jsx`, `People.jsx`, `Works.jsx`, `Lab.jsx`, `Booking.jsx`) continuam consumindo arquivos `.json` compilados no pacote da aplicação[cite: 5]. O JavaScript executado no navegador do cliente não possui permissão para reescrever arquivos no sistema de arquivos local[cite: 5].
* **Gatilhos de Teste (*Placeholders*):** Os botões de adicionar, editar e excluir atualmente disparam apenas diálogos nativos (`alert()`), sem acionar rotinas assíncronas de gravação[cite: 5].
* **Ausência de Estado Reativo:** Os dados exibidos nas listas não residem em estados do React (`useState`), impedindo que inserções ou remoções reflitam na interface sem recarregar a aplicação[cite: 5].
* **Assimetria de Esquema:** Apenas a tabela `news` foi provisionada com regras de segurança (Row Level Security - RLS) no banco; as demais entidades ainda não contam com tabelas relacionais ativas.

---

## 2. Princípio Arquitetural: Camada Dinâmica com Fallback Seguro

Para manter a confiabilidade do portal em caso de indisponibilidade de rede ou término de cotas gratuitas, a arquitetura deve obedecer à seguinte regra:
1. **Primeira Opção:** A aplicação tenta buscar os dados mais recentes do Supabase.
2. **Fallback Automático:** Caso a consulta falhe ou a tabela esteja vazia, o sistema carrega os dados locais do arquivo `.json` correspondente[cite: 5].
3. **Segurança por Linha (RLS):** Qualquer visitante realiza leitura (`SELECT`); somente sessões validadas na tabela `admins` realizam mutações (`INSERT`, `UPDATE`, `DELETE`).

---

## 3. Roteiro de Execução Passo a Passo

```
+--------------------------------------------------------------------------+
|  FASE 1: Página Piloto (News.jsx)                                        |
|  - Conectar leitura do banco com fallback em news.json                   |
|  - Gerenciar dados em estado local (useState / useEffect)                |
+--------------------------------------------------------------------------+
|
v
+--------------------------------------------------------------------------+
|  FASE 2: Interface de Captura (Modais e Formulários)                     |
|  - Criar componente modal genérico e reutilizável                        |
|  - Mapear modo "Criação" vs. modo "Edição"                               |
|  - Implementar diálogo de confirmação para exclusão segura               |
+--------------------------------------------------------------------------+
|
v
+--------------------------------------------------------------------------+
|  FASE 3: Integração das Operações CRUD no Supabase                       |
|  - Inserção (supabase.from('news').insert)                               |
|  - Atualização (supabase.from('news').update().eq('id', ...))            |
|  - Remoção (supabase.from('news').delete().eq('id', ...))                |
+--------------------------------------------------------------------------+
|
v
+--------------------------------------------------------------------------+
|  FASE 4: Sincronização Reativa e Feedback Visual                         |
|  - Atualização imediata do estado React após confirmação do backend      |
|  - Notificações de sucesso e erro (Toasts)                               |
+--------------------------------------------------------------------------+
|
v
+--------------------------------------------------------------------------+
|  FASE 5: Replicação Sequencial para Demais Entidades                     |
|  - Provisionar tabelas: members, works, equipment, lab_spaces            |
|  - Replicar padrão CRUD em People, Works, Lab e Booking                  |
+--------------------------------------------------------------------------+ 
```

---

## 4. Detalhamento das Etapas

### Fase 1: Página Piloto (`News.jsx`)
* Isolar a migração na página de notícias por já possuir a tabela `news` configurada no Supabase.
* Substituir a importação direta de `newsData` por uma carga assíncrona executada no ciclo de vida do componente.
* Armazenar os itens em estados reativos separados (`announcements` e `scientificRadar`).

### Fase 2: Componente Modal de Gestão
* Criar um modal flutuante com suporte a controle de teclado (`Esc` para fechar) e foco acessível.
* O formulário deve aceitar tanto a submissão de novos dados quanto o preenchimento prévio ao receber o objeto selecionado pelo botão de edição.
* Adicionar etapa de confirmação prévia antes de qualquer operação destrutiva (`delete`).

### Fase 3: Funções de Persistência (Camada de Serviços)
* Estruturar métodos dedicados em `src/services/` para isolar as chamadas à API do Supabase das regras visuais do React:
  * `createNewsItem(payload)`
  * `updateNewsItem(id, payload)`
  * `deleteNewsItem(id)`

### Fase 4: Atualização Otimista da Interface
* Após o retorno positivo do Supabase, atualizar imediatamente a lista em memória no React.
* Dispensar o recarregamento manual da página pelo usuário (`F5`), garantindo navegação contínua.

### Fase 5: Expansão do Esquema para as Demais Páginas
* Executar scripts SQL no Supabase para criação das tabelas complementares:
  * `members` (Pesquisadores, bolsistas e coordenação).
  * `works` (Artigos, teses e linhas de investigação).
  * `equipment` (Catálogo analítico e regras de bancada).
* Replicar a mesma camada de serviços e modais nas páginas `People.jsx`, `Works.jsx`, `Lab.jsx` e `Booking.jsx`[cite: 5].
