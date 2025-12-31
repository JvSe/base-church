"use client";

import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { PasswordInput } from "@/src/components/password-input";
import { useAuth } from "@/src/hooks";
import {
  checkUserEventEnrollment,
  generateEventCertificatePublic,
  getEventById,
  getEventCertificateByCpf,
  getEventCertificateByVerificationCode,
} from "@/src/lib/actions";
import { formatDate } from "@/src/lib/formatters";
import {
  signUpSchema,
  type SignUpScheme,
} from "@/src/lib/forms/auth/signup.scheme";
import { Button } from "@base-church/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@base-church/ui/components/form";
import { Input } from "@base-church/ui/components/input";
import { formatDocument } from "@base-church/ui/helpers/format-document.helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  Download,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CertificatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CertificatePage(props: CertificatePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationCode = searchParams.get("code");
  const { user } = useAuth();
  const [certificateBase64, setCertificateBase64] = useState<string | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  const { id: eventId } = use(props.params);

  // Formulário de cadastro
  const form = useForm<SignUpScheme>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      cpf: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Buscar dados do evento
  const { data: eventDataResult, isLoading: eventLoading } = useQuery({
    queryKey: ["public-event", eventId],
    queryFn: () => getEventById(eventId),
    select: (data) => data.event,
    gcTime: 0, // Não manter em cache
    staleTime: 0, // Sempre considerar stale
  });

  // Verificar se usuário está inscrito (apenas se estiver autenticado)
  const { data: enrollmentData, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["event-enrollment", eventId, user?.id],
    queryFn: () =>
      user?.id
        ? checkUserEventEnrollment(eventId, user.id)
        : Promise.resolve({ success: true, isEnrolled: false }),
    enabled: !!user?.id,
    gcTime: 0, // Não manter em cache
    staleTime: 0, // Sempre considerar stale
  });

  const eventData = eventDataResult;
  const isEnrolled = enrollmentData?.isEnrolled || false;
  const hasCertificate = (eventData as any)?.certificateTemplate?.isActive;

  // Buscar certificado por código de verificação (se tiver código)
  const {
    data: certificateData,
    isLoading: certificateLoading,
    error: certificateError,
  } = useQuery({
    queryKey: ["event-certificate", verificationCode],
    queryFn: () =>
      verificationCode
        ? getEventCertificateByVerificationCode(verificationCode)
        : Promise.resolve({ success: false, error: "Código não fornecido" }),
    enabled: !!verificationCode,
    select: (data) => data.certificate,
    gcTime: 0, // Não manter em cache
    staleTime: 0, // Sempre considerar stale
  });

  const certificate = certificateData;

  // Se usuário está inscrito e não tem código, buscar certificado por CPF
  const { data: certificateByCpfData, isLoading: certificateByCpfLoading } =
    useQuery({
      queryKey: ["event-certificate-cpf", eventId, user?.cpf],
      queryFn: () =>
        user?.cpf && isEnrolled
          ? getEventCertificateByCpf(eventId, user.cpf)
          : Promise.resolve({ success: false, error: "CPF não fornecido" }),
      enabled: !!user?.cpf && isEnrolled && !verificationCode && !certificate,
      select: (data) => data.certificate,
      gcTime: 0, // Não manter em cache
      staleTime: 0, // Sempre considerar stale
    });

  // Carregar base64 do certificado se disponível
  useEffect(() => {
    if (certificate?.certificateBase64) {
      setCertificateBase64(certificate.certificateBase64);
    }
  }, [certificate]);

  // Se encontrou certificado por CPF, redirecionar com código
  useEffect(() => {
    if (certificateByCpfData?.verificationCode && !verificationCode) {
      router.push(
        `/public/events/${eventId}/certificate?code=${certificateByCpfData.verificationCode}`,
      );
    }
  }, [certificateByCpfData, verificationCode, eventId, router]);

  const onSubmit = async (data: SignUpScheme) => {
    if (!hasCertificate) {
      toast.error("Este evento não possui certificado disponível");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateEventCertificatePublic(
        eventId,
        data.name,
        data.cpf,
        data.password,
      );

      if (result.success && result.certificate) {
        setCertificateGenerated(true);
        toast.success(
          result.isNew
            ? "Certificado gerado com sucesso!"
            : "Certificado já estava disponível!",
        );
        // Redirecionar para página de certificado após 2 segundos
        setTimeout(() => {
          router.push(
            `/public/events/${eventId}/certificate?code=${result.certificate.verificationCode}`,
          );
        }, 2000);
      } else {
        toast.error(result.error || "Erro ao gerar certificado");
      }
    } catch (error) {
      toast.error("Erro ao gerar certificado");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!certificateBase64) {
      toast.error("Certificado não disponível para download");
      return;
    }

    try {
      // Converter base64 para blob
      const base64Data = certificateBase64.includes(",")
        ? certificateBase64.split(",")[1]
        : certificateBase64;

      if (!base64Data) {
        toast.error("Dados do certificado inválidos");
        return;
      }

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Criar link de download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificado-${eventData?.title || "evento"}-${certificate?.verificationCode || "certificado"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao fazer download:", error);
      toast.error("Erro ao fazer download do certificado");
    }
  };

  // Preparar URL do PDF para exibição
  const getPdfUrl = (base64: string) => {
    if (!base64) return null;

    const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;

    if (!base64Data) return null;

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  };

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Redirecionar para login após 5 segundos se evento não for encontrado
  useEffect(() => {
    if (!eventData && !eventLoading) {
      const timer = setTimeout(() => {
        router.push("/signin");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [eventData, eventLoading, router]);

  useEffect(() => {
    if (certificateBase64) {
      const url = getPdfUrl(certificateBase64);
      setPdfUrl(url);
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    } else {
      setPdfUrl(null);
    }
  }, [certificateBase64]);

  if (
    eventLoading ||
    enrollmentLoading ||
    (isEnrolled && !verificationCode && certificateByCpfLoading)
  ) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <LoadingState icon={Loader2} />
      </div>
    );
  }

  if (!eventData && !eventLoading) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-4xl p-6">
          <ErrorState
            icon={AlertCircle}
            title="Evento não encontrado"
            description="O evento que você está procurando não existe ou não está mais disponível. Você será redirecionado para a página de login em 5 segundos."
          />
        </div>
      </div>
    );
  }

  // Se não tem certificado disponível
  if (!hasCertificate) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-4xl p-6">
          <ErrorState
            icon={Award}
            title="Certificado não disponível"
            description="Este evento não possui certificado disponível no momento."
          />
        </div>
        <p className="text-foreground-lighter mt-auto text-center text-xs sm:mx-auto sm:max-w-sm">
          Ao continuar, você concorda com os{" "}
          <a className="underline">Termos de Serviço</a> e{" "}
          <a className="underline">Política de Privacidade</a> do Sendo Base, e
          em receber e-mails periódicos com atualizações.
          <br />
          <br />
          <span className="font-bold">© 2025 Base Church.</span>
        </p>
      </div>
    );
  }

  // Se não tem código de verificação e usuário não está inscrito, mostrar formulário
  if (!verificationCode && !isEnrolled) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-4xl space-y-8 p-6">
          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/">
              <Image
                src="/assets/svg/sendo-base.svg"
                alt="Sendo Base Logo"
                width={200}
                height={60}
                className="h-auto w-48"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
            <div className="dark-warning-bg mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Award className="dark-warning" size={32} />
            </div>
            <h1 className="dark-text-primary mb-2 text-3xl font-bold">
              Solicitar Certificado
            </h1>
            <p className="dark-text-secondary">
              {eventData?.title || "Evento"}
            </p>
          </div>

          {/* Informação sobre cadastro */}
          <div className="dark-glass dark-shadow-md rounded-2xl p-6">
            <div className="dark-primary-subtle-bg rounded-lg p-4">
              <p className="dark-text-primary text-sm leading-relaxed">
                <strong className="font-semibold">Importante:</strong> Ao
                solicitar seu certificado, você estará criando uma conta na
                plataforma. No lançamento oficial, você poderá usar o mesmo CPF
                e senha cadastrados agora para acessar todos os seus
                certificados e conteúdos exclusivos.
              </p>
            </div>
          </div>

          {/* Certificate Registration Form */}
          {certificateGenerated ? (
            <div className="dark-glass dark-shadow-md rounded-2xl p-8">
              <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
                <div className="dark-success-bg mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <CheckCircle className="dark-success" size={32} />
                </div>
                <h3 className="dark-text-primary mb-2 text-xl font-bold">
                  Certificado Gerado com Sucesso!
                </h3>
                <p className="dark-text-secondary mb-6">
                  Seu certificado está sendo preparado. Você será redirecionado
                  automaticamente...
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="dark-primary animate-spin" size={20} />
                  <span className="dark-text-secondary text-sm">
                    Preparando certificado...
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="dark-glass dark-shadow-md rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="dark-text-primary mb-2 text-xl font-bold">
                  Preencha seus dados
                </h2>
                <p className="dark-text-secondary text-sm">
                  Preencha seus dados para gerar seu certificado de participação
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Nome completo *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Seu nome completo"
                            className="dark-input"
                            disabled={isGenerating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          CPF *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={formatDocument(field.value)}
                            onChange={(e) => {
                              const cleanValue = e.target.value.replace(
                                /\D/g,
                                "",
                              );
                              field.onChange(cleanValue);
                            }}
                            placeholder="000.000.000-00"
                            className="dark-input"
                            maxLength={14}
                            disabled={isGenerating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Senha *
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            className="dark-input"
                            disabled={isGenerating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Confirmar senha *
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            className="dark-input"
                            disabled={isGenerating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="dark-btn-primary flex-1"
                      size="lg"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando certificado...
                        </>
                      ) : (
                        <>
                          <Award className="mr-2 h-4 w-4" />
                          Gerar Certificado
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
        <p className="text-foreground-lighter mt-auto text-center text-xs sm:mx-auto sm:max-w-sm">
          Ao continuar, você concorda com os{" "}
          <a className="underline">Termos de Serviço</a> e{" "}
          <a className="underline">Política de Privacidade</a> do Sendo Base, e
          em receber e-mails periódicos com atualizações.
          <br />
          <br />
          <span className="font-bold">© 2025 Base Church.</span>
        </p>
      </div>
    );
  }

  if (certificateLoading || eventLoading) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <LoadingState icon={Loader2} />
        <p className="text-foreground-lighter mt-auto text-center text-xs sm:mx-auto sm:max-w-sm">
          Ao continuar, você concorda com os{" "}
          <a className="underline">Termos de Serviço</a> e{" "}
          <a className="underline">Política de Privacidade</a> do Sendo Base, e
          em receber e-mails periódicos com atualizações.
          <br />
          <br />
          <span className="font-bold">© 2025 Base Church.</span>
        </p>
      </div>
    );
  }

  if (certificateError || !certificate) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-4xl p-6">
          <ErrorState
            icon={AlertCircle}
            title="Certificado não encontrado"
            description="O certificado que você está procurando não existe ou o código de verificação é inválido."
          />
        </div>
        <p className="text-foreground-lighter mt-auto text-center text-xs sm:mx-auto sm:max-w-sm">
          Ao continuar, você concorda com os{" "}
          <a className="underline">Termos de Serviço</a> e{" "}
          <a className="underline">Política de Privacidade</a> do Sendo Base, e
          em receber e-mails periódicos com atualizações.
          <br />
          <br />
          <span className="font-bold">© 2025 Base Church.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-8 p-6">
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/assets/svg/sendo-base.svg"
              alt="Sendo Base Logo"
              width={200}
              height={60}
              className="my-10 h-auto w-48"
            />
          </Link>
        </div>
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
          <div className="dark-success-bg mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Award className="dark-success" size={32} />
          </div>
          <h1 className="dark-text-primary mb-2 text-3xl font-bold">
            Certificado de Participação
          </h1>
          <p className="dark-text-secondary">{eventData?.title || "Evento"}</p>
        </div>

        {/* Certificate Display */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-8">
          {/* Certificate Info */}
          <div className="mb-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="dark-primary-subtle-bg rounded-lg p-2">
                  <CheckCircle className="dark-primary" size={20} />
                </div>
                <div>
                  <div className="dark-text-primary text-sm font-medium">
                    Participante
                  </div>
                  <div className="dark-text-tertiary text-xs">
                    {certificate.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="dark-primary-subtle-bg rounded-lg p-2">
                  <Calendar className="dark-primary" size={20} />
                </div>
                <div>
                  <div className="dark-text-primary text-sm font-medium">
                    Emitido em
                  </div>
                  <div className="dark-text-tertiary text-xs">
                    {certificate.issuedAt
                      ? formatDate(new Date(certificate.issuedAt))
                      : "Não emitido"}
                  </div>
                </div>
              </div>
            </div>

            {certificate.verificationCode && (
              <div className="dark-bg-secondary rounded-lg p-4">
                <div className="dark-text-primary mb-1 text-sm font-medium">
                  Código de Verificação
                </div>
                <div className="dark-text-secondary font-mono text-sm">
                  {certificate.verificationCode}
                </div>
              </div>
            )}
          </div>

          {certificateBase64 && pdfUrl ? (
            <div className="space-y-6">
              <div className="dark-card dark-shadow-sm overflow-hidden rounded-xl">
                <iframe
                  src={pdfUrl}
                  title="Certificado"
                  className="h-[600px] w-full"
                  style={{ border: "none" }}
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  onClick={handleDownload}
                  className="dark-btn-primary flex-1"
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Certificado
                </Button>
              </div>
            </div>
          ) : (
            <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
              <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Award className="dark-text-tertiary" size={32} />
              </div>
              <h3 className="dark-text-primary mb-2 text-xl font-bold">
                Certificado em Processamento
              </h3>
              <p className="dark-text-secondary mb-6">
                Seu certificado está sendo gerado. Por favor, aguarde alguns
                instantes e recarregue a página.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="dark-btn-primary"
              >
                Recarregar Página
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-foreground-lighter mt-auto text-center text-xs sm:mx-auto sm:max-w-sm">
          Ao continuar, você concorda com os{" "}
          <a className="underline">Termos de Serviço</a> e{" "}
          <a className="underline">Política de Privacidade</a> do Sendo Base, e
          em receber e-mails periódicos com atualizações.
          <br />
          <br />
          <span className="font-bold">© 2025 Base Church.</span>
        </p>
      </div>
    </div>
  );
}
