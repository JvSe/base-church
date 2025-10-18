# 🔥 Sistema de Streak (Sequência de Acesso)

Sistema para incentivar o engajamento diário dos usuários através de sequências de dias consecutivos estudando.

## 📋 Funcionalidades

### 1. Verificação no Login

- ✅ A cada login, o sistema verifica se passaram **24 horas** desde o último acesso
- ✅ Se passaram 24h ou mais, o `currentStreak` é **zerado**
- ✅ Se não passaram 24h, o streak é **mantido**

### 2. Incremento ao Completar Aula

- ✅ Quando o usuário completa uma aula, o sistema verifica se é a **primeira aula do dia**
- ✅ Se for a primeira aula do dia, o `currentStreak` é **incrementado em 1**
- ✅ Se não for a primeira aula do dia, o streak **não é alterado**
- ✅ O `longestStreak` é atualizado se o streak atual for maior

## 🗄️ Estrutura de Dados

### User (tabela `users`)

```typescript
{
  currentStreak: number; // Streak atual do usuário
}
```

### UserStats (tabela `user_stats`)

```typescript
{
  userId: string;
  currentStreak: number; // Dias consecutivos com atividade
  longestStreak: number; // Maior sequência já alcançada
  lastActivityAt: DateTime; // Última atividade (usado para verificar se é mesmo dia)
}
```

## 🔄 Fluxo de Funcionamento

### Login

```
1. Usuário faz login
2. Sistema busca UserStats
3. Se não existe → Criar com streak = 0
4. Se existe:
   a. Verifica lastActivityAt
   b. Se diff >= 24h → Zera currentStreak
   c. Se diff < 24h → Mantém currentStreak
5. Atualiza lastActivityAt
```

### Completar Aula

```
1. Usuário completa uma aula
2. Sistema busca UserStats
3. Se não existe → Criar com streak = 1
4. Se existe:
   a. Verifica se é o mesmo dia (lastActivityAt)
   b. Se não é o mesmo dia:
      - Incrementa currentStreak
      - Atualiza longestStreak (se necessário)
      - Atualiza lastActivityAt
   c. Se é o mesmo dia:
      - Não altera currentStreak
      - Apenas atualiza lastActivityAt
```

## 📁 Arquivos Implementados

### 1. Helper de Streak

**Arquivo:** `apps/sendo-base/src/lib/helpers/streak.helper.ts`

**Funções:**

- `checkAndUpdateLoginStreak(userId)` - Verifica e zera streak no login (se necessário)
- `updateStreakOnLessonCompletion(userId)` - Incrementa streak ao completar aula

### 2. Autenticação

**Arquivo:** `apps/sendo-base/src/lib/actions/auth.ts`

**Alterações:**

- `signIn()` - Chama `checkAndUpdateLoginStreak()` após validação de senha
- `signUp()` - Cria `UserStats` inicial para novos usuários

### 3. Progresso de Aulas

**Arquivo:** `apps/sendo-base/src/lib/actions/course.ts`

**Alterações:**

- `updateLessonProgress()` - Chama `updateStreakOnLessonCompletion()` quando aula é completada

## 🧪 Exemplos de Uso

### Exemplo 1: Usuário Novo

```typescript
// Dia 1 - Registro
signUp(); // UserStats criado com streak = 0

// Dia 1 - Primeira aula
updateLessonProgress(); // streak = 1 ✅

// Dia 1 - Segunda aula
updateLessonProgress(); // streak = 1 (mesma data)

// Dia 2 - Login
signIn(); // Verifica: diff < 24h, streak mantido = 1

// Dia 2 - Primeira aula
updateLessonProgress(); // streak = 2 ✅
```

### Exemplo 2: Usuário Quebra Streak

```typescript
// Segunda - Login
signIn(); // streak atual = 5

// Segunda - Aula
updateLessonProgress(); // streak = 6 ✅

// Quarta - Login (2 dias depois, > 24h)
signIn(); // streak zerado = 0 ❌

// Quarta - Aula
updateLessonProgress(); // streak = 1 ✅ (recomeça)
```

### Exemplo 3: Múltiplas Aulas no Mesmo Dia

```typescript
// 10:00 - Primeira aula
updateLessonProgress(); // streak = 1 ✅

// 14:00 - Segunda aula
updateLessonProgress(); // streak = 1 (mesma data)

// 20:00 - Terceira aula
updateLessonProgress(); // streak = 1 (mesma data)

// Próximo dia 09:00 - Primeira aula
updateLessonProgress(); // streak = 2 ✅
```

## 🎯 Regras Importantes

1. ✅ **Apenas 1 incremento por dia**: Completar múltiplas aulas no mesmo dia só incrementa o streak uma vez
2. ✅ **Janela de 24h**: Se passar 24h sem atividade, o streak é zerado no próximo login
3. ✅ **Sincronização**: `currentStreak` é mantido em `User` e `UserStats` para fácil acesso
4. ✅ **Longest Streak**: O `longestStreak` é sempre atualizado quando o `currentStreak` for maior
5. ✅ **lastActivityAt**: Usado para determinar se é o mesmo dia e calcular diferença de 24h

## 🔧 Manutenção

### Resetar Streak de um Usuário

```typescript
// Via Prisma
await prisma.userStats.update({
  where: { userId: "user-id" },
  data: {
    currentStreak: 0,
    lastActivityAt: new Date(),
  },
});

await prisma.user.update({
  where: { id: "user-id" },
  data: { currentStreak: 0 },
});
```

### Ver Estatísticas de Streak

```typescript
// Buscar top streaks
const topStreaks = await prisma.userStats.findMany({
  orderBy: { currentStreak: "desc" },
  take: 10,
  include: {
    user: {
      select: { name: true, image: true },
    },
  },
});
```

## 📊 Benefícios

- 🎯 **Engajamento**: Incentiva usuários a estudarem todos os dias
- 🏆 **Gamificação**: Cria senso de conquista e progresso
- 📈 **Retenção**: Usuários voltam diariamente para manter streak
- 🎖️ **Reconhecimento**: Pode ser usado para badges e rankings

## 🚀 Futuras Melhorias

- [ ] Notificações para lembrar de manter o streak
- [ ] Badges/conquistas por milestones (7 dias, 30 dias, etc.)
- [ ] Ranking de maiores streaks
- [ ] "Congelar streak" (item premium)
- [ ] Histórico de streaks quebrados


