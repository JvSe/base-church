# 📋 INVENTÁRIO DE DUPLICAÇÕES - PASTA COURSES

**Data:** 14/10/2025  
**Escopo:** `/apps/sendo-base/src/app/(private)/dashboard/courses/`  
**Status:** 🔍 Análise Completa Finalizada

---

## 🎯 RESUMO EXECUTIVO

### Estatísticas Gerais

- **Arquivos Analisados:** 13 arquivos
- **Linhas de Código Total:** ~3,700 linhas
- **Duplicações Críticas Identificadas:** 18 padrões
- **Potencial de Redução:** ~40-50% (estimado ~1,500 linhas)
- **Componentes a Criar/Unificar:** 12

---

## 📊 MAPA DE DUPLICAÇÕES

### NÍVEL 1: DUPLICAÇÃO CRÍTICA (Alta Prioridade)

#### 1.1 **SCHEMAS DE VALIDAÇÃO DUPLICADOS**

**Problema:** Schemas idênticos duplicados em 2 arquivos

**Locais:**

- ✅ `create/page.tsx` (linhas 51-91)
- ✅ `[courseId]/edit/page.tsx` (linhas 62-101)

**Duplicação:**

```typescript
// courseSchema - 100% IDÊNTICO
const courseSchema = z.object({
  title: z.string().min(1, "Título é obrigatório")...
});

// moduleSchema - 100% IDÊNTICO
const moduleSchema = z.object({
  title: z.string().min(1, "Título do módulo é obrigatório")...
});

// lessonSchema - DIFERENÇA MÍNIMA (apenas enum values)
const lessonSchema = z.object({
  // create: usa ["video", "text", "objective_quiz", "subjective_quiz"]
  // edit: usa ["VIDEO", "TEXT", "OBJECTIVE_QUIZ", "SUBJECTIVE_QUIZ"]
});

// certificateTemplateSchema - 100% IDÊNTICO
const certificateTemplateSchema = z.object({...});
```

**Oportunidade:**

- **Arquivo:** `lib/forms/course-schemas.ts`
- **Redução:** ~120 linhas eliminadas
- **Benefício:** Validações consistentes em todo o projeto

---

#### 1.2 **INTERFACES/TYPES DUPLICADAS**

**Problema:** Interfaces duplicadas em múltiplos arquivos

**Locais:**

- `create/page.tsx` (linhas 98-135)
- `[courseId]/edit/page.tsx` (linhas 108-145)
- `components/lesson-form.tsx` (linhas 37-52)
- `components/question-form.tsx` (linhas 28-43)
- `components/question-list.tsx` (linhas 12-27)

**Duplicação:**

```typescript
// Interface Module - Duplicada 2x
interface Module {
  id?: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

// Interface Question - Duplicada 4x
interface Question {
  id?: string;
  questionText: string;
  points: number;
  order: number;
  explanation?: string;
  type: "objective" | "subjective";
  // ...
}

// Interface Lesson - Duplicada 3x (com pequenas variações)
interface Lesson {
  id?: string;
  title: string;
  // ...
}
```

**Oportunidade:**

- **Arquivo:** `lib/types/course.types.ts`
- **Redução:** ~80 linhas eliminadas
- **Benefício:** Type safety centralizado

---

#### 1.3 **FUNÇÕES UTILITÁRIAS DUPLICADAS**

**Problema:** Funções idênticas repetidas em múltiplos arquivos

**Locais:**

- `create/page.tsx` (linhas 512-539)
- `[courseId]/edit/page.tsx` (linhas 729-757)

**Duplicação:**

```typescript
// 100% IDÊNTICO
const getLessonTypeIcon = (type: string) => {
  switch (type) {
    case "video": return Play;
    // ...
  }
}

// 100% IDÊNTICO
const getLessonTypeText = (type: string) => {
  switch (type) {
    case "video": return "Vídeo";
    // ...
  }
}

// DUPLICADO - components/courses-list-client.tsx
const getStatusColor = (status: CourseStatus) => {...}
const getStatusText = (status: CourseStatus) => {...}
const getStatusIcon = (status: CourseStatus) => {...}
const formatDuration = (minutes: number) => {...}
```

**Oportunidade:**

- **Arquivo:** `lib/helpers/course.helper.ts`
- **Redução:** ~60 linhas eliminadas
- **Benefício:** Formatadores centralizados

---

#### 1.4 **LÓGICA DE GERENCIAMENTO DE ESTADO DUPLICADA**

**Problema:** Lógica idêntica de manipulação de módulos/lições

**Locais:**

- `create/page.tsx` (linhas 137-510)
- `[courseId]/edit/page.tsx` (linhas 154-635)

**Duplicação:**

```typescript
// Estados duplicados
const [modules, setModules] = useState<Module[]>([]);
const [showModuleForm, setShowModuleForm] = useState(false);
const [editingModule, setEditingModule] = useState<number | null>(null);
const [showLessonForm, setShowLessonForm] = useState<number | null>(null);
const [editingLesson, setEditingLesson] = useState<{...} | null>(null);
const [showQuestionForm, setShowQuestionForm] = useState<{...} | null>(null);
// + 6 estados adicionais

// Handlers duplicados (~400 linhas)
const handleAddModule = async (data) => {...}
const handleEditModule = (moduleIndex) => {...}
const handleSaveModuleEdit = async (data, moduleIndex) => {...}
const handleAddLesson = async (data, moduleIndex) => {...}
const handleEditLesson = (moduleIndex, lessonIndex) => {...}
const handleSaveLessonEdit = async (data, ...) => {...}
const handleCreateCertificateTemplate = async (data) => {...}
const convertFileToBase64 = (file: File) => {...}
```

**Oportunidade:**

- **Hooks:** `use-course-modules.ts`, `use-course-lessons.ts`
- **Redução:** ~500 linhas eliminadas
- **Benefício:** Lógica reutilizável e testável

---

### NÍVEL 2: DUPLICAÇÃO MODERADA (Média Prioridade)

#### 2.1 **COMPONENTES ACCORDION DUPLICADOS**

**Problema:** Estrutura de Accordion quase idêntica para Módulos e Lições

**Locais:**

- `create/page.tsx` (linhas 596-1082)
- `[courseId]/edit/page.tsx` (linhas 877-1343)

**Semelhanças:**

- Mesma estrutura de Accordion aninhado
- Mesmos estilos e classes CSS
- Mesma lógica de abrir/fechar
- Mesmos botões de ação (Adicionar, Editar, Excluir)

**Diferenças:**

- create: usa índice local, edit: usa IDs do banco
- edit: tem handlers de delete com API calls

**Oportunidade:**

- **Componentes:** `ModuleAccordion.tsx`, `LessonAccordion.tsx`
- **Redução:** ~300 linhas eliminadas
- **Benefício:** UI consistente e manutenível

---

#### 2.2 **ESTADOS DE LOADING/ERROR DUPLICADOS**

**Problema:** Código de loading state duplicado

**Locais:**

- `page.tsx` (linhas 33-56) - Error state
- `[courseId]/edit/page.tsx` (linhas 760-811) - Loading + Error states

**Duplicação:**

```tsx
// Loading State
<div className="dark-bg-primary min-h-screen pb-20">
  <div className="fixed inset-0 opacity-3">...</div>
  <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
    <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
      <BookOpen className="dark-text-tertiary" size={32} />
    </div>
    <h1 className="dark-text-primary mb-2 text-2xl font-bold">
      Carregando curso...
    </h1>
    // ...
  </div>
</div>

// Error State - Estrutura 95% similar
```

**Oportunidade:**

- **Componente:** Já existe `loading-state.tsx` e `error-state.tsx` em `common/feedback/`
- **Ação:** Substituir código inline por componentes existentes
- **Redução:** ~100 linhas eliminadas

---

#### 2.3 **CARD STATS DUPLICADO**

**Problema:** Cards de estatísticas na página principal

**Locais:**

- `page.tsx` (linhas 118-214)

**Padrão:**

```tsx
// 4 cards quase idênticos
<div className="dark-card dark-shadow-sm rounded-xl p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="dark-text-tertiary text-sm font-medium">Total de Cursos</p>
      <p className="dark-text-primary text-2xl font-bold">{totalCourses}</p>
    </div>
    <div className="dark-primary-subtle-bg rounded-xl p-3">
      <BookOpen className="dark-primary" size={24} />
    </div>
  </div>
  // ...
</div>
```

**Oportunidade:**

- **Componente:** `StatsCard.tsx` ou usar componente genérico `MetricCard`
- **Redução:** ~80 linhas eliminadas

---

### NÍVEL 3: DUPLICAÇÃO LEVE (Baixa Prioridade)

#### 3.1 **FORMULÁRIOS SIMILARES**

**Problema:** Estrutura de formulários repetida

**Locais:**

- `components/course-info-form.tsx` (300 linhas)
- `components/module-form.tsx` (95 linhas)
- `components/lesson-form.tsx` (386 linhas)
- `components/certificate-form.tsx` (204 linhas)

**Semelhanças:**

- Mesma estrutura de Form wrapper
- Mesmos FormFields
- Mesmos botões de ação (Cancelar/Salvar)
- Mesmos estilos

**Oportunidade:**

- Já existe `FormSection` utilizado
- Possível criar `FormActions` para botões padronizados
- **Redução:** ~40 linhas eliminadas

---

#### 3.2 **CONVERSÃO DE TIPOS DUPLICADA**

**Problema:** Lógica de conversão de enums

**Locais:**

- `create/page.tsx` (linhas 376-382)
- Outros lugares fazem cast direto

**Duplicação:**

```typescript
// Mapear tipos para o formato do banco
let lessonType: "VIDEO" | "TEXT" | "OBJECTIVE_QUIZ" | "SUBJECTIVE_QUIZ" =
  "VIDEO";
if (data.type === "video") lessonType = "VIDEO";
else if (data.type === "text") lessonType = "TEXT";
// ...
```

**Oportunidade:**

- **Helper:** `mapLessonTypeToDb()`, `mapLessonTypeFromDb()`
- **Redução:** ~20 linhas eliminadas

---

#### 3.3 **BACKGROUND PATTERN DUPLICADO**

**Problema:** Background pattern repetido

**Status:** ✅ JÁ RESOLVIDO via `PageLayout` component

- Usado em `create/page.tsx` e `[courseId]/edit/page.tsx`

---

## 🔧 PROBLEMAS ADICIONAIS IDENTIFICADOS

### 4.1 **INCONSISTÊNCIAS DE NOMENCLATURA**

**Problema:** Enums com nomenclaturas diferentes

```typescript
// create/page.tsx usa lowercase
type: z.enum(["video", "text", "objective_quiz", "subjective_quiz"]);

// [courseId]/edit/page.tsx usa UPPERCASE
type: z.enum(["VIDEO", "TEXT", "OBJECTIVE_QUIZ", "SUBJECTIVE_QUIZ"]);

// lesson-form.tsx usa UPPERCASE no select mas lowercase no watcher
```

**Impacto:** Confusão e possíveis bugs

---

### 4.2 **LÓGICA DE QUESTÕES DUPLICADA**

**Problema:** Código de criação de questões quase idêntico

**Locais:**

- `create/page.tsx` (linhas 935-1035)
- `[courseId]/edit/page.tsx` (linhas 1206-1296)

**Oportunidade:**

- Extrair para função helper
- **Redução:** ~90 linhas eliminadas

---

### 4.3 **GESTÃO DE ACORDEÕES COMPLEXA**

**Problema:** Estados complexos de acordeões abertos

```typescript
const [openModules, setOpenModules] = useState<string[]>([]);
const [openLessons, setOpenLessons] = useState<string[]>([]);
// Lógica complexa de gerenciamento
```

**Oportunidade:**

- Hook `useAccordionState`

---

## 📈 MÉTRICAS DE IMPACTO

### Redução de Código Estimada

| Categoria       | Linhas Antes | Linhas Depois | Economia |
| --------------- | ------------ | ------------- | -------- |
| Schemas         | 240          | 120           | **50%**  |
| Types           | 120          | 40            | **67%**  |
| Helpers         | 120          | 30            | **75%**  |
| Estado/Handlers | 1000         | 500           | **50%**  |
| Acordeões       | 600          | 300           | **50%**  |
| Loading/Error   | 150          | 50            | **67%**  |
| Stats Cards     | 96           | 16            | **83%**  |
| **TOTAL**       | **~2,326**   | **~1,056**    | **~55%** |

### Benefícios Qualitativos

✅ **Manutenibilidade:** Alterações em 1 lugar propagam para todos os usos  
✅ **Consistência:** Comportamento uniforme em todo o sistema  
✅ **Testabilidade:** Componentes/hooks isolados mais fáceis de testar  
✅ **Type Safety:** Types centralizados evitam inconsistências  
✅ **Performance:** Menos código = bundle menor  
✅ **Developer Experience:** Menos código = menos bugs potenciais

---

## 🎯 PLANO DE AÇÃO PRIORIZADO

### FASE 1: Fundações (Alto Impacto, Rápido)

1. ✅ Criar `lib/forms/course-schemas.ts` com todos os schemas
2. ✅ Criar `lib/types/course.types.ts` com todas as interfaces
3. ✅ Criar `lib/helpers/course.helper.ts` com funções utilitárias
4. ✅ Substituir Loading/Error states por componentes existentes

**Estimativa:** 2-3 horas  
**Redução:** ~400 linhas

### FASE 2: Hooks Customizados (Alto Impacto, Médio Esforço)

5. ✅ Criar `hooks/use-course-modules.ts`
6. ✅ Criar `hooks/use-course-lessons.ts`
7. ✅ Criar `hooks/use-course-questions.ts`
8. ✅ Criar `hooks/use-accordion-state.ts`

**Estimativa:** 4-5 horas  
**Redução:** ~600 linhas

### FASE 3: Componentes de UI (Médio Impacto, Médio Esforço)

9. ✅ Criar `components/common/data-display/stats-card.tsx`
10. ✅ Criar `components/common/data-display/module-accordion.tsx`
11. ✅ Criar `components/common/data-display/lesson-accordion.tsx`
12. ✅ Refatorar `FormActions` padronizado

**Estimativa:** 3-4 horas  
**Redução:** ~400 linhas

### FASE 4: Migração e Validação

13. ✅ Migrar `create/page.tsx` para usar novos componentes
14. ✅ Migrar `[courseId]/edit/page.tsx` para usar novos componentes
15. ✅ Validar funcionalidades (criar, editar, deletar)
16. ✅ Testes manuais completos
17. ✅ Ajustes finais

**Estimativa:** 3-4 horas

---

## 🏗️ ESTRUTURA DE ARQUIVOS PROPOSTA

```
apps/sendo-base/src/
├── lib/
│   ├── forms/
│   │   └── course-schemas.ts           # ✨ NOVO
│   ├── types/
│   │   └── course.types.ts             # ✨ NOVO
│   ├── helpers/
│   │   └── course.helper.ts            # ✨ NOVO
│   └── hooks/
│       ├── use-course-modules.ts       # ✨ NOVO
│       ├── use-course-lessons.ts       # ✨ NOVO
│       ├── use-course-questions.ts     # ✨ NOVO
│       └── use-accordion-state.ts      # ✨ NOVO
│
└── components/
    └── common/
        ├── data-display/
        │   ├── stats-card.tsx          # ✨ NOVO
        │   ├── module-accordion.tsx    # ✨ NOVO
        │   └── lesson-accordion.tsx    # ✨ NOVO
        └── forms/
            └── form-actions.tsx        # ✨ NOVO

# Arquivos Existentes (Refatorar)
apps/sendo-base/src/app/(private)/dashboard/courses/
├── page.tsx                            # 🔄 REFATORAR
├── create/page.tsx                     # 🔄 REFATORAR
├── [courseId]/edit/page.tsx            # 🔄 REFATORAR
└── components/
    ├── course-info-form.tsx            # 🔄 AJUSTAR
    ├── module-form.tsx                 # ✅ OK (mínimas mudanças)
    ├── lesson-form.tsx                 # 🔄 AJUSTAR
    ├── certificate-form.tsx            # ✅ OK
    └── ...
```

---

## ⚠️ RISCOS E CONSIDERAÇÕES

### Riscos Técnicos

1. **Breaking Changes:** Mudanças em types podem quebrar código dependente
2. **Testes:** Sem testes automatizados, validação manual é crítica
3. **Estado Complexo:** Lógica de módulos/lições tem interdependências

### Mitigações

- ✅ Migração incremental (fase por fase)
- ✅ Git commits frequentes por feature
- ✅ Manter código antigo até validação completa
- ✅ Checklist de testes manuais detalhado

---

## 📝 CHECKLIST DE VALIDAÇÃO

Após cada fase, validar:

**Funcionalidades de Curso:**

- [ ] Criar curso
- [ ] Editar curso
- [ ] Deletar curso
- [ ] Listar cursos
- [ ] Buscar cursos
- [ ] Ver estatísticas

**Funcionalidades de Módulo:**

- [ ] Adicionar módulo
- [ ] Editar módulo
- [ ] Deletar módulo
- [ ] Reordenar módulos (se aplicável)

**Funcionalidades de Lição:**

- [ ] Adicionar lição (Vídeo)
- [ ] Adicionar lição (Texto)
- [ ] Adicionar lição (Quiz Objetivo)
- [ ] Adicionar lição (Quiz Subjetivo)
- [ ] Editar lição
- [ ] Deletar lição

**Funcionalidades de Questão:**

- [ ] Adicionar questão objetiva
- [ ] Adicionar questão subjetiva
- [ ] Editar questão
- [ ] Deletar questão
- [ ] Validação de opções corretas

**Funcionalidades de Certificado:**

- [ ] Criar template
- [ ] Editar template
- [ ] Upload de PDF
- [ ] Preview de certificado

---

## 🎉 CONCLUSÃO

O inventário identificou **18 padrões de duplicação** com potencial de redução de **~55% do código** (~1,270 linhas).

A refatoração proposta seguirá os princípios:

- ✅ **DRY:** Don't Repeat Yourself
- ✅ **SOLID:** Single Responsibility
- ✅ **Composition over Configuration**
- ✅ **Progressive Enhancement:** Migração incremental segura

**Próximo Passo:** Iniciar FASE 1 - Criar arquivos de fundação (schemas, types, helpers)
