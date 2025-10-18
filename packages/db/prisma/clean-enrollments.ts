import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Script para limpar todas as matrículas e dados relacionados
 *
 * Este script irá deletar:
 * 1. Todas as respostas dos alunos (StudentAnswer)
 * 2. Todo o progresso das aulas (LessonProgress)
 * 3. Todos os certificados emitidos (Certificate)
 * 4. Todas as matrículas (Enrollment)
 * 5. Resetar estatísticas dos usuários (UserStats)
 * 6. Resetar contador de alunos nos cursos
 *
 * ⚠️  ATENÇÃO: Esta operação é IRREVERSÍVEL!
 */

async function cleanEnrollments() {
  console.log("🚀 Iniciando limpeza de matrículas...\n");

  try {
    // 1. Deletar todas as respostas dos alunos
    console.log("📝 Deletando respostas dos alunos...");
    const deletedAnswers = await prisma.studentAnswer.deleteMany({});
    console.log(`   ✅ ${deletedAnswers.count} resposta(s) deletada(s)\n`);

    // 2. Deletar todo o progresso das aulas
    console.log("📚 Deletando progresso das aulas...");
    const deletedProgress = await prisma.lessonProgress.deleteMany({});
    console.log(`   ✅ ${deletedProgress.count} progresso(s) deletado(s)\n`);

    // 3. Deletar todos os certificados emitidos
    console.log("🎓 Deletando certificados emitidos...");
    const deletedCertificates = await prisma.certificate.deleteMany({
      where: {
        status: {
          in: ["ISSUED", "REVOKED"],
        },
      },
    });
    console.log(
      `   ✅ ${deletedCertificates.count} certificado(s) deletado(s)\n`
    );

    // 4. Deletar todas as matrículas
    console.log("📋 Deletando matrículas...");
    const deletedEnrollments = await prisma.enrollment.deleteMany({});
    console.log(`   ✅ ${deletedEnrollments.count} matrícula(s) deletada(s)\n`);

    // 5. Resetar estatísticas dos usuários
    console.log("📊 Resetando estatísticas dos usuários...");
    const updatedStats = await prisma.userStats.updateMany({
      data: {
        coursesCompleted: 0,
        certificatesEarned: 0,
        hoursStudied: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalPoints: 0,
        level: 1,
        experience: 0,
        lastActivityAt: null,
      },
    });
    console.log(`   ✅ ${updatedStats.count} estatística(s) resetada(s)\n`);

    // 6. Resetar contador de alunos nos cursos
    console.log("🎯 Resetando contador de alunos nos cursos...");
    const updatedCourses = await prisma.course.updateMany({
      data: {
        studentsCount: 0,
      },
    });
    console.log(`   ✅ ${updatedCourses.count} curso(s) atualizado(s)\n`);

    // 7. Resetar campos de progresso dos usuários
    console.log("👤 Resetando campos de progresso dos usuários...");
    const updatedUsers = await prisma.user.updateMany({
      data: {
        currentStreak: 0,
        totalPoints: 0,
        level: 1,
        experience: 0,
      },
    });
    console.log(`   ✅ ${updatedUsers.count} usuário(s) atualizado(s)\n`);

    // Resumo final
    console.log("=".repeat(50));
    console.log("✅ LIMPEZA CONCLUÍDA COM SUCESSO!");
    console.log("=".repeat(50));
    console.log("\n📊 Resumo da operação:");
    console.log(`   • Respostas deletadas: ${deletedAnswers.count}`);
    console.log(`   • Progressos deletados: ${deletedProgress.count}`);
    console.log(`   • Certificados deletados: ${deletedCertificates.count}`);
    console.log(`   • Matrículas deletadas: ${deletedEnrollments.count}`);
    console.log(`   • Estatísticas resetadas: ${updatedStats.count}`);
    console.log(`   • Cursos atualizados: ${updatedCourses.count}`);
    console.log(`   • Usuários atualizados: ${updatedUsers.count}`);
    console.log(
      "\n✨ Todas as matrículas e dados relacionados foram removidos!\n"
    );
  } catch (error) {
    console.error("❌ Erro ao limpar matrículas:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar apenas se for chamado diretamente
if (require.main === module) {
  cleanEnrollments()
    .then(() => {
      console.log("🎉 Script finalizado com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erro fatal:", error);
      process.exit(1);
    });
}

export { cleanEnrollments };
