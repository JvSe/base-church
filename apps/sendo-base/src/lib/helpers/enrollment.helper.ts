type EnrollmentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | string;

export function getEnrollmentStatusText(status: EnrollmentStatus): string {
  switch (status) {
    case "pending":
      return "Pendente";
    case "approved":
      return "Aprovado";
    case "rejected":
      return "Rejeitado";
    case "cancelled":
      return "Cancelado";
    default:
      return "Desconhecido";
  }
}

export function getEnrollmentStatusColor(status: EnrollmentStatus): string {
  switch (status) {
    case "pending":
      return "dark-warning-bg dark-warning";
    case "approved":
      return "dark-success-bg dark-success";
    case "rejected":
      return "dark-error-bg dark-error";
    case "cancelled":
      return "dark-text-tertiary bg-muted";
    default:
      return "dark-text-tertiary bg-muted";
  }
}
