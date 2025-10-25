// CertificateTemplate Types
export interface CertificateTemplate {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  templateUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  course: {
    id: string;
    title: string;
    instructor?: {
      id: string;
      name: string;
      isPastor: boolean;
    };
  };
}

export interface CreateCertificateTemplateInput {
  courseId: string;
  title: string;
  description?: string;
  templateUrl?: string;
}

export interface UpdateCertificateTemplateInput {
  title?: string;
  description?: string;
  templateUrl?: string;
  isActive?: boolean;
}

// Certificate Types
export interface Certificate {
  id: string;
  userId?: string;
  courseId: string;
  templateId: string;
  status: "PENDING" | "ISSUED" | "REVOKED";
  issuedAt?: Date;
  certificateUrl?: string;
  verificationCode?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: {
    id: string;
    name: string | null;
    email: string | null;
  };
  course: {
    id: string;
    title: string;
  };
  template: {
    id: string;
    title: string;
    description?: string;
  };
}

export interface CreateCertificateInput {
  courseId: string;
  templateId: string;
  userId?: string;
}

export interface UpdateCertificateInput {
  status?: "PENDING" | "ISSUED" | "REVOKED";
  certificateUrl?: string;
  issuedAt?: Date;
}

export interface IssueCertificateInput {
  certificateId: string;
  userId: string;
  certificateUrl?: string;
}

// Form Data Types
export interface CertificateTemplateFormData {
  courseId: string;
  title: string;
  description: string;
  templateUrl?: string;
}

export interface CertificateFormData {
  courseId: string;
  templateId: string;
  userId?: string;
}

export interface CertificateStats {
  totalCertificates: number;
  issuedCertificates: number;
  pendingCertificates: number;
  averageGrade: number;
}
