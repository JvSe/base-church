"use client";

import { createUserInvite } from "@/src/lib/actions/invite";
import { Button } from "@base-church/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@base-church/ui/components/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@base-church/ui/components/form";
import { Input } from "@base-church/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@base-church/ui/components/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  Send,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createInviteSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  role: z.enum(["MEMBROS", "ADMIN"]),
});

type CreateInviteScheme = z.infer<typeof createInviteSchema>;

type CreateInviteModalProps = {
  adminId: string;
  triggerButton?: React.ReactNode;
};

export function CreateInviteModal({
  adminId,
  triggerButton,
}: CreateInviteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const form = useForm<CreateInviteScheme>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "MEMBROS",
    },
  });

  const onSubmit = async (data: CreateInviteScheme) => {
    setIsLoading(true);
    try {
      const result = await createUserInvite({
        name: data.name,
        email: data.email || undefined,
        role: data.role,
        createdBy: adminId,
      });

      if (result.success && result.inviteLink) {
        setInviteLink(result.inviteLink);
        setExpiresAt(result.expiresAt || null);
        toast.success("Convite criado com sucesso!", {
          description:
            "O link foi gerado e está pronto para ser compartilhado.",
        });
      } else {
        toast.error("Erro ao criar convite", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Erro ao criar convite", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      toast.success("Link copiado!", {
        description: "O link foi copiado para sua área de transferência",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setInviteLink(null);
    setExpiresAt(null);
    form.reset();
  };

  const formatExpirationDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button size="lg" className="gap-2">
            <UserPlus className="h-5 w-5" />
            Criar Convite
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="dark-glass sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {inviteLink ? "Convite Criado" : "Criar Novo Convite"}
          </DialogTitle>
          <DialogDescription>
            {inviteLink
              ? "Compartilhe o link abaixo com o novo usuário"
              : "Preencha os dados para gerar um link de convite"}
          </DialogDescription>
        </DialogHeader>

        {!inviteLink ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nome Completo
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: João da Silva"
                        disabled={isLoading}
                        className="dark-glass dark-border"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Nome que será exibido na tela de cadastro
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email (Opcional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="joao@example.com"
                        disabled={isLoading}
                        className="dark-glass dark-border"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Email será exibido na tela de cadastro
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Usuário</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="dark-glass dark-border">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MEMBROS">Membro</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Permissões que o usuário terá na plataforma
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Gerar Convite
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-5">
            {/* Success Message */}
            <div className="dark-bg-secondary rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="dark-text-primary font-semibold">
                    Convite Gerado!
                  </h4>
                  <p className="dark-text-secondary mt-1 text-sm">
                    O link está pronto para ser compartilhado
                  </p>
                </div>
              </div>
            </div>

            {/* Link Display */}
            <div className="space-y-2">
              <label className="dark-text-secondary text-sm font-medium">
                Link de Convite
              </label>
              <div className="dark-glass dark-border flex items-center gap-2 rounded-lg p-3">
                <code className="dark-text-primary flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                  {inviteLink}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Expiration Info */}
            {expiresAt && (
              <div className="dark-bg-secondary rounded-lg p-3">
                <p className="dark-text-tertiary text-xs">
                  ⏰ <span className="font-medium">Validade:</span>{" "}
                  {formatExpirationDate(expiresAt)}
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="dark-bg-secondary space-y-2 rounded-lg p-4">
              <h4 className="dark-text-primary text-sm font-semibold">
                📋 Próximos Passos
              </h4>
              <ol className="dark-text-secondary space-y-1 text-xs">
                <li>1. Copie o link acima</li>
                <li>2. Envie por email, WhatsApp ou outro meio</li>
                <li>3. O usuário acessará e completará o cadastro</li>
                <li>4. Após cadastro, ele terá acesso à plataforma</li>
              </ol>
            </div>

            {/* Close Button */}
            <Button onClick={handleClose} className="w-full" size="lg">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
