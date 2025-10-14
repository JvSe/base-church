# 📦 Componentização da Página de Criação de Curso

## ✅ O que foi feito:

### 1. Estrutura de Pastas Criada

```
apps/sendo-base/src/app/(private)/dashboard/courses/
├── components/
│   ├── certificate-form.tsx      (Formulário de certificado)
│   ├── course-header.tsx          (Cabeçalho com botões de ação)
│   ├── course-info-form.tsx       (Formulário de informações do curso)
│   ├── lesson-form.tsx            (Formulário de lição)
│   ├── module-form.tsx            (Formulário de módulo)
│   ├── question-form.tsx          (Formulário de questões)
│   ├── question-list.tsx          (Listagem de questões)
│   └── index.ts                   (Exports centralizados)
├── create/
│   ├── page.tsx                   (Página principal)
│   └── page.tsx.backup            (Backup do original)
```

### 2. Componentes Criados

#### **course-header.tsx**

- Cabeçalho da página com botões
- Props: `courseId`, `hasModules`, `isLoading`, `onSaveDraft`, `onFinishCourse`

#### **course-info-form.tsx**

- Formulário completo de informações do curso
- Props: `form`, `courseId`, `isLoading`, `leadersData`, `leadersLoading`, `onSubmit`

#### **module-form.tsx**

- Formulário para adicionar/editar módulo
- Props: `form`, `isLoading`, `onSubmit`, `onCancel`

#### **lesson-form.tsx**

- Formulário para adicionar lição (todos os tipos)
- Props: `form`, `isLoading`, `selectedLessonType`, `onSubmit`, `onCancel`

#### **certificate-form.tsx**

- Formulário de template de certificado
- Props: `form`, `isLoading`, `isEditing`, `courseTitle`, `courseDescription`, `certificateFile`, `setCertificateFile`, `onSubmit`, `onCancel`

#### **question-form.tsx**

- Formulário para adicionar questões
- Props: `onAddQuestion`, `onCancel`, `isLoading`

#### **question-list.tsx**

- Lista questões de uma atividade
- Props: `questions`, `onEdit`, `onDelete`

---

## 🔄 Como Usar os Componentes

### Exemplo de Importação:

```typescript
import {
  CertificateForm,
  CourseHeader,
  CourseInfoForm,
  LessonForm,
  ModuleForm,
  QuestionForm,
  QuestionList,
} from "../components";
```

### Exemplo de Uso - Cabeçalho:

```typescript
<CourseHeader
  courseId={courseId}
  hasModules={modules.length > 0}
  isLoading={isLoading}
  onSaveDraft={handleSaveDraft}
  onFinishCourse={handleFinishCourse}
/>
```

### Exemplo de Uso - Formulário de Curso:

```typescript
<CourseInfoForm
  form={courseForm}
  courseId={courseId}
  isLoading={isLoading}
  leadersData={leadersData || []}
  leadersLoading={leadersLoading}
  onSubmit={handleCreateCourse}
/>
```

### Exemplo de Uso - Formulário de Módulo:

```typescript
{showModuleForm && (
  <ModuleForm
    form={moduleForm}
    isLoading={isLoading}
    onSubmit={handleAddModule}
    onCancel={() => {
      setShowModuleForm(false);
      moduleForm.reset();
    }}
  />
)}
```

### Exemplo de Uso - Formulário de Lição:

```typescript
{showLessonForm === moduleIndex && (
  <LessonForm
    form={lessonForm}
    isLoading={isLoading}
    selectedLessonType={selectedLessonType}
    onSubmit={(data) => handleAddLesson(data, moduleIndex)}
    onCancel={() => {
      setShowLessonForm(null);
      lessonForm.reset();
    }}
  />
)}
```

---

## 📝 Estrutura da Página Principal (Simplificada)

```typescript
export default function CreateCoursePage() {
  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  // ... outros estados

  // Forms
  const courseForm = useForm<CourseFormData>({...});
  const moduleForm = useForm<ModuleFormData>({...});
  const lessonForm = useForm<LessonFormData>({...});
  // ... outros forms

  // Handlers (mantidos na página principal)
  const handleCreateCourse = async (data: CourseFormData) => {...};
  const handleAddModule = async (data: ModuleFormData) => {...};
  const handleAddLesson = async (data: LessonFormData, moduleIndex: number) => {...};
  // ... outros handlers

  return (
    <div className="dark-bg-primary min-h-screen pb-20">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(...)]" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8 p-6">
        {/* Header */}
        <CourseHeader
          courseId={courseId}
          hasModules={modules.length > 0}
          isLoading={isLoading}
          onSaveDraft={handleSaveDraft}
          onFinishCourse={handleFinishCourse}
        />

        {/* Course Form */}
        <CourseInfoForm
          form={courseForm}
          courseId={courseId}
          isLoading={isLoading}
          leadersData={leadersData || []}
          leadersLoading={leadersLoading}
          onSubmit={handleCreateCourse}
        />

        {/* Modules Section */}
        {courseId && (
          <div className="space-y-6">
            {/* Add Module Button and Form */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <div className="flex items-center justify-between">
                <h2>Módulos do Curso ({modules.length})</h2>
                <Button onClick={() => setShowModuleForm(!showModuleForm)}>
                  Adicionar Módulo
                </Button>
              </div>

              {showModuleForm && (
                <ModuleForm
                  form={moduleForm}
                  isLoading={isLoading}
                  onSubmit={handleAddModule}
                  onCancel={() => setShowModuleForm(false)}
                />
              )}
            </div>

            {/* Modules List with Accordion */}
            {modules.length > 0 && (
              <Accordion type="multiple" value={openModules} onValueChange={setOpenModules}>
                {modules.map((module, moduleIndex) => (
                  <AccordionItem key={moduleIndex} value={`module-${moduleIndex}`}>
                    <AccordionTrigger>{module.title}</AccordionTrigger>
                    <AccordionContent>
                      {/* Lesson Form */}
                      {showLessonForm === moduleIndex && (
                        <LessonForm
                          form={lessonForm}
                          isLoading={isLoading}
                          selectedLessonType={selectedLessonType}
                          onSubmit={(data) => handleAddLesson(data, moduleIndex)}
                          onCancel={() => setShowLessonForm(null)}
                        />
                      )}

                      {/* Lessons List */}
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex}>
                          <h5>{lesson.title}</h5>

                          {/* Questions if it's an activity */}
                          {lesson.isActivity && (
                            <>
                              <QuestionList
                                questions={lesson.questions || []}
                                onEdit={(q, i) => handleEditQuestion(q, i)}
                                onDelete={(id, i) => handleDeleteQuestion(id, i)}
                              />

                              <QuestionForm
                                onAddQuestion={(q) => handleAddQuestion(q)}
                                onCancel={() => setShowQuestionForm(null)}
                                isLoading={isLoading}
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {/* Certificate Section */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h2>Template de Certificado</h2>
              {showCertificateForm && (
                <CertificateForm
                  form={certificateTemplateForm}
                  isLoading={isLoading}
                  isEditing={editingCertificate}
                  courseTitle={courseTitle}
                  courseDescription={courseDescription}
                  certificateFile={certificateFile}
                  setCertificateFile={setCertificateFile}
                  onSubmit={handleCreateCertificateTemplate}
                  onCancel={() => setShowCertificateForm(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## ✅ Vantagens da Componentização

### 1. **Manutenibilidade**

- Cada componente tem uma responsabilidade clara
- Fácil localizar e corrigir bugs
- Código mais organizado e legível

### 2. **Reusabilidade**

- Componentes podem ser reutilizados em outras páginas
- Fácil criar variações (ex: editar curso vs criar curso)

### 3. **Testabilidade**

- Cada componente pode ser testado isoladamente
- Props bem definidas facilitam testes unitários

### 4. **Performance**

- React otimiza re-renders de componentes menores
- Apenas componentes afetados são re-renderizados

### 5. **Escalabilidade**

- Fácil adicionar novos campos ou funcionalidades
- Estrutura clara para novos desenvolvedores

---

## 📋 Checklist de Migração

### Passos para migrar a página atual:

1. ✅ **Criar componentes** - FEITO
2. ✅ **Mover arquivos existentes** - FEITO
3. ⏳ **Refatorar página principal**:
   - [ ] Importar componentes
   - [ ] Substituir blocos de código por componentes
   - [ ] Manter handlers na página
   - [ ] Passar props corretas
   - [ ] Testar cada seção
4. ⏳ **Testes**:
   - [ ] Criar curso
   - [ ] Adicionar módulos
   - [ ] Adicionar lições (todos os tipos)
   - [ ] Adicionar questões
   - [ ] Criar certificado
   - [ ] Finalizar curso

---

## 🔧 Próximos Passos Recomendados

### 1. Refatoração Incremental

- Não refatore tudo de uma vez
- Comece pelo cabeçalho (mais simples)
- Depois formulário de curso
- Depois módulos e lições
- Por último, questões e certificado

### 2. Manter Backup

- O arquivo `page.tsx.backup` está salvo
- Se algo der errado, é só restaurar

### 3. Testar Continuamente

- A cada componente substituído, teste
- Não continue se algo quebrar

### 4. Adicionar TypeScript Strict

- Os componentes já têm tipos bem definidos
- Ajuda a pegar erros em tempo de desenvolvimento

---

## 💡 Dicas

1. **Imports Organizados**: Use o index.ts para importar tudo de uma vez
2. **Props Drilling**: Se ficar muito profundo, considere Context API
3. **Estado Global**: Para estados complexos, considere Zustand ou Redux
4. **Validação**: Mantida no schema Zod, reutilizável
5. **Handlers**: Mantenha na página principal, passe como props

---

## 📁 Arquivos Importantes

- **Backup Original**: `page.tsx.backup`
- **Componentes**: `../components/`
- **Este Guia**: `COMPONENTIZACAO_CURSO.md`

---

## 🎯 Resultado Final

Após a refatoração completa:

- ✅ Arquivo principal: ~400-500 linhas (vs 2246 linhas original)
- ✅ Componentes: 7 arquivos bem organizados
- ✅ Código mais limpo e manutenível
- ✅ Mesma funcionalidade, melhor estrutura
- ✅ Pronto para escalar

---

**Status**: Componentes criados, estrutura pronta para uso! 🎉
**Próximo passo**: Refatorar página principal incrementalmente
