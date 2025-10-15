import { Info } from "lucide-react";

const enrollmentSteps = [
  {
    number: 1,
    title: "Solicite sua matrícula",
    description: 'Clique em "Solicitar Matrícula" para enviar sua solicitação',
  },
  {
    number: 2,
    title: "Aguarde aprovação",
    description: "Os líderes da igreja analisarão sua solicitação",
  },
  {
    number: 3,
    title: "Acesso liberado",
    description: "Após aprovação, você terá acesso completo ao curso",
  },
];

export function EnrollmentProcess() {
  return (
    <div className="dark-card dark-border mt-6 rounded-xl p-6">
      <h3 className="dark-text-primary mb-4 flex items-center gap-2 font-semibold">
        <Info className="dark-primary" size={20} />
        Como funciona a matrícula?
      </h3>
      <div className="space-y-3">
        {enrollmentSteps.map((step) => (
          <div key={step.number} className="flex items-start gap-3">
            <div className="dark-primary-subtle-bg dark-primary flex h-6 min-w-[24px] items-center justify-center rounded-full p-1 text-xs font-bold">
              {step.number}
            </div>
            <div>
              <p className="dark-text-primary text-sm font-medium">
                {step.title}
              </p>
              <p className="dark-text-secondary text-xs">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
