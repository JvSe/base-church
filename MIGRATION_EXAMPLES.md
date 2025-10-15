# 🔄 EXEMPLOS PRÁTICOS DE MIGRAÇÃO

**Guia passo-a-passo** para migrar as páginas existentes

---

## 📋 ORDEM DE MIGRAÇÃO RECOMENDADA

1. ✅ **page.tsx** (listagem) - Mais simples, baixo risco
2. ✅ **create/page.tsx** - Média complexidade
3. ✅ **[courseId]/edit/page.tsx** - Mais complexa, mas similar ao create

---

## 1️⃣ MIGRAÇÃO: `page.tsx` (Listagem)

### Mudanças Necessárias

#### A) Imports

**ADICIONAR:**

```typescript
import {
  formatDuration,
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/src/lib/helpers/course.helper";
import { StatsCard } from "@/src/components/common/data-display/stats-card";
import { getStatsIconConfig } from "@/src/lib/helpers/course.helper";
```

**REMOVER (agora importado dos helpers):**

```typescript
// Deletar estas funções locais:
function getStatusColor(status: CourseStatus) { ... }
function getStatusText(status: CourseStatus) { ... }
function getStatusIcon(status: CourseStatus) { ... }
function formatDuration(minutes: number) { ... }
```

#### B) Substituir Stats Cards

**ANTES (linhas 118-214):**

```typescript
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
  <div className="dark-card dark-shadow-sm rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="dark-text-tertiary text-sm font-medium">
          Total de Cursos
        </p>
        <p className="dark-text-primary text-2xl font-bold">
          {totalCourses}
        </p>
      </div>
      <div className="dark-primary-subtle-bg rounded-xl p-3">
        <BookOpen className="dark-primary" size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <TrendingUp className="dark-success mr-1" size={16} />
      <span className="dark-success font-medium">
        {totalCourses} cursos criados
      </span>
    </div>
  </div>
  {/* + 3 cards similares */}
</div>
```

**DEPOIS:**

```typescript
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
  <StatsCard
    label="Total de Cursos"
    value={totalCourses}
    iconConfig={getStatsIconConfig('courses')}
    trend={{
      value: `${totalCourses} cursos criados`,
      isPositive: true,
    }}
  />

  <StatsCard
    label="Cursos Publicados"
    value={publishedCourses}
    iconConfig={getStatsIconConfig('published')}
    trend={{
      value: `${totalCourses > 0 ? Math.round((publishedCourses / totalCourses) * 100) : 0}% publicados`,
      isPositive: true,
    }}
  />

  <StatsCard
    label="Total de Inscrições"
    value={totalStudents}
    iconConfig={getStatsIconConfig('students')}
    trend={{
      value: `${totalCourses > 0 ? Math.round(totalStudents / totalCourses) : 0} por curso`,
      isPositive: true,
    }}
  />

  <StatsCard
    label="Conclusões"
    value={totalCompletions}
    iconConfig={getStatsIconConfig('completions')}
    trend={{
      value: `${totalStudents > 0 ? Math.round((totalCompletions / totalStudents) * 100) : 0}% taxa`,
      isPositive: true,
    }}
  />
</div>
```

#### C) Usar Helpers nas Listagens

**ANTES (em courses-list-client.tsx):**

```typescript
// Funções locais duplicadas
function getStatusColor(status: CourseStatus) { ... }
function getStatusText(status: CourseStatus) { ... }
function getStatusIcon(status: CourseStatus) { ... }
function formatDuration(minutes: number) { ... }
```

**DEPOIS:**

```typescript
// Import e uso direto
import {
  getStatusColor,
  getStatusText,
  getStatusIcon,
  formatDuration
} from '@/src/lib/helpers/course.helper';

// Uso
<span className={getStatusColor(course.status)}>
  {(() => {
    const StatusIcon = getStatusIcon(course.status);
    return <StatusIcon size={12} />;
  })()}
  {getStatusText(course.status)}
</span>

// Duração
<Clock className="mr-1 inline h-3 w-3" />
Duração: {formatDuration(course.duration)}
```

---

## 2️⃣ MIGRAÇÃO: `create/page.tsx`

### Mudanças Necessárias

#### A) Imports Completos

**ADICIONAR no topo:**

```typescript
// Schemas e Types
import {
  courseSchema,
  moduleSchema,
  lessonSchema,
  certificateTemplateSchema,
  type CourseFormData,
  type ModuleFormData,
  type LessonFormData,
  type CertificateTemplateFormData,
} from "@/src/lib/forms/course-schemas";

import type { Module, Lesson, Question } from "@/src/lib/types/course.types";

// Helpers
import {
  getLessonTypeIcon,
  getLessonTypeText,
  convertFileToBase64,
} from "@/src/lib/helpers/course.helper";

// Hooks
import { useCourseModules } from "@/src/hooks/use-course-modules";
import { useCourseLessons } from "@/src/hooks/use-course-lessons";
import { useCourseQuestions } from "@/src/hooks/use-course-questions";
import { useAccordionState } from "@/src/hooks/use-accordion-state";
```

**REMOVER (agora importados):**

```typescript
// Deletar linhas 51-91: Schemas locais
const courseSchema = z.object({ ... })
const moduleSchema = z.object({ ... })
const lessonSchema = z.object({ ... })
const certificateTemplateSchema = z.object({ ... })

// Deletar linhas 93-135: Types locais
type CourseFormData = z.infer<typeof courseSchema>;
interface Module { ... }
interface Question { ... }
interface Lesson { ... }

// Deletar linhas 512-539: Funções utilitárias
const getLessonTypeIcon = (type: string) => { ... }
const getLessonTypeText = (type: string) => { ... }
const convertFileToBase64 = (file: File) => { ... }
```

#### B) Substituir Estado e Handlers de Módulos

**ANTES (linhas 137-303):**

```typescript
const [modules, setModules] = useState<Module[]>([]);
const [showModuleForm, setShowModuleForm] = useState(false);
const [editingModule, setEditingModule] = useState<number | null>(null);

// Handler de adicionar módulo (30 linhas)
const handleAddModule = async (data: ModuleFormData) => {
  if (!courseId) return;
  setIsLoading(true);
  try {
    const result = await createModule(courseId, {
      ...data,
      order: modules.length + 1,
    });
    if (result.success && result.module) {
      const newModule: Module = {
        id: result.module.id,
        title: data.title,
        description: data.description,
        order: modules.length + 1,
        lessons: [],
      };
      setModules([...modules, newModule]);
      moduleForm.reset();
      setShowModuleForm(false);
      toast.success("Módulo adicionado com sucesso!");
    } else {
      toast.error(result.error || "Erro ao criar módulo");
    }
  } catch (error) {
    toast.error("Erro ao criar módulo");
  } finally {
    setIsLoading(false);
  }
};

// Handler de editar módulo (20 linhas)
const handleEditModule = (moduleIndex: number) => { ... }

// Handler de salvar edição (25 linhas)
const handleSaveModuleEdit = async (data: ModuleFormData, moduleIndex: number) => { ... }
```

**DEPOIS:**

```typescript
// Hook simplificado substitui ~200 linhas
const {
  modules,
  isLoading: isLoadingModules,
  showModuleForm,
  setShowModuleForm,
  editingModuleIndex,
  addModule,
  startEditModule,
  cancelEditModule,
  saveModule,
  removeModuleByIndex,
  setModules,
} = useCourseModules(courseId || "", {
  onModuleChange: (modules) => {
    // Callback opcional se necessário
  },
});
```

#### C) Substituir Estado e Handlers de Lições

**ANTES (linhas 304-434):**

```typescript
const [showLessonForm, setShowLessonForm] = useState<number | null>(null);
const [editingLesson, setEditingLesson] = useState<{
  moduleIndex: number;
  lessonIndex: number;
} | null>(null);

// Handler de adicionar lição (80 linhas)
const handleAddLesson = async (data: LessonFormData, moduleIndex: number) => {
  if (!courseId) return;
  const module = modules[moduleIndex];
  if (!module || !module.id) return;

  // Validação de quiz
  const isQuiz = data.type === "objective_quiz" || data.type === "subjective_quiz";
  if (isQuiz && module.lessons.length > 0) {
    const hasActivity = module.lessons.some((l) => l.isActivity);
    if (hasActivity) {
      toast.error("...");
      return;
    }
  }

  setIsLoading(true);
  const youtubeEmbedId = extractYouTubeEmbedId(data.videoUrl || "");

  // Mapear tipos
  let lessonType: "VIDEO" | "TEXT" | "OBJECTIVE_QUIZ" | "SUBJECTIVE_QUIZ" = "VIDEO";
  if (data.type === "video") lessonType = "VIDEO";
  // ...

  try {
    const result = await createLesson(module.id, {
      ...data,
      type: lessonType,
      youtubeEmbedId: youtubeEmbedId || undefined,
      order: module.lessons.length + 1,
      isActivity: isQuiz,
    });
    // ... resto da lógica
  } catch (error) {
    // ...
  } finally {
    setIsLoading(false);
  }
};

// Handler de editar lição (20 linhas)
const handleEditLesson = (moduleIndex: number, lessonIndex: number) => { ... }

// Handler de salvar lição (30 linhas)
const handleSaveLessonEdit = async (data, moduleIndex, lessonIndex) => { ... }
```

**DEPOIS:**

```typescript
// Hook simplificado substitui ~200 linhas
const {
  isLoading: isLoadingLessons,
  showLessonForm,
  setShowLessonForm,
  editingLesson,
  addLesson,
  startEditLesson,
  cancelEditLesson,
  saveLesson,
  removeLessonByIndex,
} = useCourseLessons(modules, setModules);
```

#### D) Substituir Estado e Handlers de Questões

**ANTES (linhas 935-1035):**

```typescript
const [showQuestionForm, setShowQuestionForm] = useState<{
  moduleIndex: number;
  lessonIndex: number;
} | null>(null);

// Handler de adicionar questão (100 linhas)
onSuccess={async (question) => {
  if (!lesson.id) {
    toast.error("Lição precisa ser criada primeiro");
    return;
  }

  setIsLoading(true);
  try {
    let result;
    if (question.type === "objective") {
      result = await createObjectiveQuestion({
        lessonId: lesson.id,
        questionText: question.questionText,
        points: question.points,
        order: question.order,
        explanation: question.explanation,
        options: question.options || [],
      });
    } else {
      result = await createSubjectiveQuestion({
        lessonId: lesson.id,
        questionText: question.questionText,
        points: question.points,
        order: question.order,
        explanation: question.explanation,
        subjectiveAnswerType: question.subjectiveAnswerType as "TEXT" | "FILE",
        correctAnswer: question.correctAnswer,
      });
    }

    if (result.success && result.question) {
      const updatedModules = [...modules];
      if (!updatedModules[moduleIndex]?.lessons[lessonIndex]?.questions) {
        updatedModules[moduleIndex]!.lessons[lessonIndex]!.questions = [];
      }
      updatedModules[moduleIndex]?.lessons[lessonIndex]?.questions!.push({
        ...question,
        id: result.question.id,
      });
      setModules(updatedModules);
      setShowQuestionForm(null);
    } else {
      toast.error(result.error || "Erro ao criar questão");
    }
  } catch (error) {
    toast.error("Erro ao criar questão");
  } finally {
    setIsLoading(false);
  }
}}
```

**DEPOIS:**

```typescript
// Hook simplificado substitui ~100 linhas
const {
  isLoading: isLoadingQuestions,
  showQuestionForm,
  setShowQuestionForm,
  addQuestion,
  removeQuestion,
} = useCourseQuestions(modules, setModules);

// Uso
<QuestionForm
  currentQuestionsCount={lesson.questions?.length || 0}
  onSuccess={async (question) => {
    await addQuestion(question, moduleIndex, lessonIndex);
  }}
  onCancel={() => setShowQuestionForm(null)}
/>
```

#### E) Substituir Gerenciamento de Acordeões

**ANTES:**

```typescript
const [openModules, setOpenModules] = useState<string[]>([]);

// Lógica manual de gerenciamento
setOpenModules([...openModules, `module-${moduleIndex}`]);
```

**DEPOIS:**

```typescript
const { openItems, openItem, isOpen } = useAccordionState();

// Uso com Accordion
<Accordion
  type="multiple"
  value={openItems}
  onValueChange={(value) => {
    // Lógica de mudança se necessário
  }}
>
  {/* ... */}
</Accordion>

// Abrir módulo programaticamente
openItem(`module-${moduleIndex}`);
```

#### F) Ajustar Formulários

**ANTES:**

```typescript
const courseForm = useForm<CourseFormData>({
  resolver: zodResolver(courseSchema),
  defaultValues: { ... }
});

const moduleForm = useForm<ModuleFormData>({
  resolver: zodResolver(moduleSchema),
  defaultValues: { ... }
});

const lessonForm = useForm<LessonFormData>({
  resolver: zodResolver(lessonSchema),
  defaultValues: { ... }
});
```

**DEPOIS (sem mudanças, apenas imports diferentes):**

```typescript
// Imports dos schemas já ajustados no passo A
const courseForm = useForm<CourseFormData>({
  resolver: zodResolver(courseSchema),
  defaultValues: { ... }
});

const moduleForm = useForm<ModuleFormData>({
  resolver: zodResolver(moduleSchema),
  defaultValues: { ... }
});

// ATENÇÃO: Ajustar tipo no lessonSchema
const lessonForm = useForm<LessonFormData>({
  resolver: zodResolver(lessonSchema),
  defaultValues: {
    title: "",
    description: "",
    content: "",
    videoUrl: "",
    duration: 15,
    type: "VIDEO", // ⚠️ Agora é UPPERCASE
  },
});
```

#### G) Ajustar Handlers dos Formulários

**ANTES:**

```typescript
<ModuleForm
  form={moduleForm}
  isLoading={isLoading}
  onSubmit={handleAddModule}
  onCancel={() => {
    setShowModuleForm(false);
    moduleForm.reset();
  }}
/>
```

**DEPOIS:**

```typescript
<ModuleForm
  form={moduleForm}
  isLoading={isLoadingModules}
  onSubmit={(data) => addModule(data)}
  onCancel={() => {
    setShowModuleForm(false);
    moduleForm.reset();
  }}
/>
```

**ANTES:**

```typescript
<LessonForm
  form={lessonForm}
  isLoading={isLoading}
  onSubmit={(data) => handleAddLesson(data, moduleIndex)}
  onCancel={() => {
    setShowLessonForm(null);
    lessonForm.reset();
  }}
/>
```

**DEPOIS:**

```typescript
<LessonForm
  form={lessonForm}
  isLoading={isLoadingLessons}
  onSubmit={(data) => addLesson(data, moduleIndex)}
  onCancel={() => {
    setShowLessonForm(null);
    lessonForm.reset();
  }}
/>
```

---

## 3️⃣ MIGRAÇÃO: `[courseId]/edit/page.tsx`

### Mudanças Necessárias

**Similar ao `create/page.tsx` com alguns ajustes:**

#### A) Imports (Idênticos ao create)

#### B) Hooks com Inicialização

**DIFERENÇA PRINCIPAL: Edit page tem dados iniciais do banco**

```typescript
// Buscar dados do curso
const { data: courseData, isLoading: courseLoading } = useQuery({
  queryKey: ["course", courseId],
  queryFn: () => getCourseById(courseId),
  select: (data) => data.course,
});

// Buscar módulos do curso
const { data: modulesData, refetch: refetchModules } = useQuery({
  queryKey: ["course-modules", courseId],
  queryFn: () => getCourseModules(courseId),
  select: (data) => data.modules,
});

// Usar hook com dados iniciais
const {
  modules,
  addModule,
  removeModule,
  startEditModule,
  saveModule,
  setModules,
} = useCourseModules(courseId, {
  initialModules: modulesData || [],
  onModuleChange: () => {
    refetchModules(); // Revalidar dados
  },
});

// Atualizar módulos quando dados chegarem
useEffect(() => {
  if (modulesData) {
    const transformedModules = modulesData.map((module: any) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      order: module.order,
      lessons:
        module.lessons?.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration,
          order: lesson.order,
          type: lesson.type,
        })) || [],
    }));
    setModules(transformedModules);
  }
}, [modulesData]);
```

#### C) Handlers de Delete

**DIFERENÇA: Edit page chama API de delete**

```typescript
// Usar hook com handler de delete da API
const { removeModule } = useCourseModules(courseId);

// Uso
<Button
  onClick={(e) => {
    e.stopPropagation();
    removeModule(module.id, moduleIndex); // ✅ Com ID do banco
  }}
>
  <Trash2 className="h-3 w-3" />
  Excluir módulo
</Button>
```

#### D) Certificado

**EDIT PAGE tem template existente, precisa de update handler**

```typescript
// Handler de update (não coberto pelos hooks - manter manual)
const handleUpdateCertificateTemplate = async (data) => {
  if (!courseId || !courseData?.certificateTemplate) return;

  setIsLoading(true);
  try {
    let templateUrl = courseData.certificateTemplate.templateUrl || "";
    if (certificateFile) {
      templateUrl = await convertFileToBase64(certificateFile);
    }

    const result = await updateCertificateTemplate(
      courseData.certificateTemplate.id,
      {
        title: data.title,
        description: data.description,
        templateUrl,
        isActive: true,
      }
    );

    if (result.success) {
      toast.success("Template atualizado!");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    }
  } catch (error) {
    toast.error("Erro ao atualizar template");
  } finally {
    setIsLoading(false);
  }
};
```

---

## 4️⃣ AJUSTES EM COMPONENTES

### A) `components/lesson-form.tsx`

**MUDAR tipo enum de lowercase para UPPERCASE:**

**ANTES:**

```typescript
<Select defaultValue={field.value}>
  <SelectItem value="video">Vídeo</SelectItem>
  <SelectItem value="text">Texto</SelectItem>
  <SelectItem value="objective_quiz">Atividade Objetiva</SelectItem>
  <SelectItem value="subjective_quiz">Atividade Subjetiva</SelectItem>
</Select>
```

**DEPOIS:**

```typescript
<Select defaultValue={field.value}>
  <SelectItem value="VIDEO">Vídeo</SelectItem>
  <SelectItem value="TEXT">Texto</SelectItem>
  <SelectItem value="OBJECTIVE_QUIZ">Atividade Objetiva</SelectItem>
  <SelectItem value="SUBJECTIVE_QUIZ">Atividade Subjetiva</SelectItem>
</Select>
```

**E ajustar watchers:**

**ANTES:**

```typescript
const selectedLessonType = form.watch("type");

const isActivity =
  selectedLessonType === "objective_quiz" ||
  selectedLessonType === "subjective_quiz";
```

**DEPOIS:**

```typescript
const selectedLessonType = form.watch("type");

const isActivity =
  selectedLessonType === "OBJECTIVE_QUIZ" ||
  selectedLessonType === "SUBJECTIVE_QUIZ";
```

### B) `components/courses-list-client.tsx`

**ADICIONAR imports:**

```typescript
import {
  getStatusColor,
  getStatusIcon,
  getStatusText,
  formatDuration,
} from "@/src/lib/helpers/course.helper";
```

**REMOVER funções locais:**

```typescript
// Deletar estas funções (linhas 65-105)
function getStatusColor(status: CourseStatus) { ... }
function getStatusText(status: CourseStatus) { ... }
function getStatusIcon(status: CourseStatus) { ... }
function formatDuration(minutes: number) { ... }
```

---

## ✅ CHECKLIST DE MIGRAÇÃO

### page.tsx (Listagem)

- [ ] Importar helpers de `course.helper.ts`
- [ ] Importar `StatsCard`
- [ ] Substituir 4 cards de estatísticas por `StatsCard`
- [ ] Remover funções utilitárias locais
- [ ] Testar listagem de cursos
- [ ] Testar busca
- [ ] Testar estatísticas

### create/page.tsx

- [ ] Importar schemas de `course-schemas.ts`
- [ ] Importar types de `course.types.ts`
- [ ] Importar helpers de `course.helper.ts`
- [ ] Importar hooks customizados
- [ ] Remover schemas locais (linhas 51-91)
- [ ] Remover interfaces locais (linhas 93-135)
- [ ] Remover funções utilitárias (linhas 512-539)
- [ ] Substituir estado e handlers de módulos por `useCourseModules`
- [ ] Substituir estado e handlers de lições por `useCourseLessons`
- [ ] Substituir estado e handlers de questões por `useCourseQuestions`
- [ ] Substituir gerenciamento de acordeões por `useAccordionState`
- [ ] Ajustar handlers dos formulários
- [ ] Testar criação de curso completo
- [ ] Testar adição de módulos
- [ ] Testar adição de lições
- [ ] Testar adição de questões
- [ ] Testar certificado

### [courseId]/edit/page.tsx

- [ ] Todos os itens do create/page.tsx
- [ ] Ajustar hooks para usar dados iniciais do banco
- [ ] Ajustar handlers de delete (usar API)
- [ ] Manter handler de update de certificado
- [ ] Testar edição de curso
- [ ] Testar edição de módulos
- [ ] Testar edição de lições
- [ ] Testar deleção de módulos/lições
- [ ] Testar certificado (criar e editar)

### Componentes

- [ ] Ajustar `lesson-form.tsx` para usar UPPERCASE
- [ ] Ajustar `courses-list-client.tsx` para usar helpers
- [ ] Remover funções duplicadas dos componentes

---

## 🎯 RESULTADO ESPERADO

**Após migração completa:**

| Arquivo                    | Linhas Antes | Linhas Depois | Redução  |
| -------------------------- | ------------ | ------------- | -------- |
| `page.tsx`                 | 223          | ~143          | **36%**  |
| `create/page.tsx`          | 1,144        | ~650          | **43%**  |
| `[courseId]/edit/page.tsx` | 1,464        | ~900          | **39%**  |
| `courses-list-client.tsx`  | 273          | ~220          | **19%**  |
| **TOTAL**                  | **3,104**    | **~1,913**    | **~38%** |

**Ganhos:**

- ✅ ~1,200 linhas de código eliminadas
- ✅ Código mais limpo e organizado
- ✅ Manutenibilidade melhorada
- ✅ Reutilização de lógica
- ✅ Types consistentes
- ✅ Funcionalidade 100% preservada

---

## 🛟 TROUBLESHOOTING

### Problema: Type errors após migração

**Solução:**

- Verificar se tipos estão sendo importados de `course.types.ts`
- Verificar se enums estão em UPPERCASE (`VIDEO` não `video`)
- Verificar se `LessonType` está sendo usado corretamente

### Problema: Formulário não funciona

**Solução:**

- Verificar se schemas estão sendo importados corretamente
- Verificar se `zodResolver` está configurado
- Verificar se handlers estão passando dados corretamente para hooks

### Problema: Estado não atualiza

**Solução:**

- Verificar se `setModules` está sendo chamado nos hooks
- Verificar se callbacks `onModuleChange` estão configurados
- Verificar se `refetch` está sendo chamado após mutações

### Problema: Acordeões não abrem/fecham

**Solução:**

- Verificar se `useAccordionState` está configurado corretamente
- Verificar se `value` e `onValueChange` estão passados para `<Accordion>`
- Verificar se IDs dos items são únicos

---

**Criado por:** AI Assistant  
**Data:** 14/10/2025  
**Versão:** 1.0
