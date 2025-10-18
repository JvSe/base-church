# 🧹 Script de Limpeza de Matrículas

Este script remove **TODAS** as matrículas e dados relacionados do banco de dados.

## ⚠️ ATENÇÃO - OPERAÇÃO IRREVERSÍVEL

Este script **NÃO PODE SER DESFEITO**. Todos os dados serão **PERMANENTEMENTE DELETADOS**.

## 📋 O que será deletado/resetado:

### Dados Deletados:

1. ✅ **StudentAnswer** - Todas as respostas dos alunos às questões
2. ✅ **LessonProgress** - Todo o progresso das aulas
3. ✅ **Certificate** - Todos os certificados emitidos (ISSUED e REVOKED)
4. ✅ **Enrollment** - Todas as matrículas

### Dados Resetados (zerados):

5. ✅ **UserStats** - Estatísticas dos usuários:
   - `coursesCompleted` → 0
   - `certificatesEarned` → 0
   - `hoursStudied` → 0
   - `currentStreak` → 0
   - `longestStreak` → 0
   - `totalPoints` → 0
   - `level` → 1
   - `experience` → 0
   - `lastActivityAt` → null

6. ✅ **Course** - Contador de alunos:
   - `studentsCount` → 0

7. ✅ **User** - Campos de progresso:
   - `currentStreak` → 0
   - `totalPoints` → 0
   - `level` → 1
   - `experience` → 0

## 🚀 Como executar:

### Opção 1: Via linha de comando (recomendado)

```bash
cd packages/db
npx tsx prisma/clean-enrollments.ts
```

### Opção 2: Via pnpm script (se configurado no package.json)

```bash
pnpm db:clean-enrollments
```

## 🔒 Dados que NÃO serão afetados:

- ✅ Usuários (cadastros mantidos)
- ✅ Cursos (conteúdo mantido)
- ✅ Módulos e Lições
- ✅ Questões e Opções
- ✅ Templates de Certificados (mantidos para futuros certificados)
- ✅ Eventos e outras funcionalidades

## 📊 Output Esperado:

```
🚀 Iniciando limpeza de matrículas...

📝 Deletando respostas dos alunos...
   ✅ 156 resposta(s) deletada(s)

📚 Deletando progresso das aulas...
   ✅ 423 progresso(s) deletado(s)

🎓 Deletando certificados emitidos...
   ✅ 12 certificado(s) deletado(s)

📋 Deletando matrículas...
   ✅ 89 matrícula(s) deletada(s)

📊 Resetando estatísticas dos usuários...
   ✅ 45 estatística(s) resetada(s)

🎯 Resetando contador de alunos nos cursos...
   ✅ 15 curso(s) atualizado(s)

👤 Resetando campos de progresso dos usuários...
   ✅ 45 usuário(s) atualizado(s)

==================================================
✅ LIMPEZA CONCLUÍDA COM SUCESSO!
==================================================

📊 Resumo da operação:
   • Respostas deletadas: 156
   • Progressos deletados: 423
   • Certificados deletados: 12
   • Matrículas deletadas: 89
   • Estatísticas resetadas: 45
   • Cursos atualizados: 15
   • Usuários atualizados: 45

✨ Todas as matrículas e dados relacionados foram removidos!

🎉 Script finalizado com sucesso!
```

## 🛡️ Recomendações de Segurança:

1. **Backup**: Faça backup do banco de dados antes de executar
2. **Ambiente**: Execute primeiro em ambiente de desenvolvimento/staging
3. **Validação**: Valide o script antes de executar em produção
4. **Horário**: Execute fora do horário de pico
5. **Notificação**: Avise os usuários sobre a manutenção

## ⏪ Como Reverter (se tiver backup):

Se você tiver um backup do banco de dados, pode restaurá-lo usando:

```bash
# PostgreSQL
pg_restore -d nome_do_banco backup.dump

# Ou via psql
psql nome_do_banco < backup.sql
```

## 🆘 Suporte:

Em caso de problemas, contate o time de desenvolvimento.
