"use client";

import { getUserProfile, updateUserProfileData } from "@/src/lib/actions";
import { dayjs } from "@/src/lib/dayjs";
import {
  addressSchema,
  AddressScheme,
} from "@/src/lib/forms/profile/address.scheme";
import {
  adicionalDataSchema,
  AdicionalDataScheme,
} from "@/src/lib/forms/profile/adicional-data.scheme";
import {
  PersonalDataScheme,
  personalSchema,
} from "@/src/lib/forms/profile/personal-data.scheme";
import {
  cleanCep,
  fetchCepData,
  formatCep,
} from "@/src/lib/helpers/cep.helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { DatePicker } from "@repo/ui/components/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { formatDocument } from "@repo/ui/helpers/format-document.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Save, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProfileEditPersonalPage() {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingAdditional, setIsEditingAdditional] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  const queryClient = useQueryClient();

  const { data: userAuth, isLoading } = useQuery({
    queryKey: ["user", "30d453b9-88c9-429e-9700-81d2db735f7a"],
    queryFn: () => getUserProfile("30d453b9-88c9-429e-9700-81d2db735f7a"),
    select: (data) => data.user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfileData,
    onSuccess: () => {
      console.log("Perfil atualizado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["user", "30d453b9-88c9-429e-9700-81d2db735f7a"],
      });
      setIsEditingPersonal(false);
      setIsEditingAddress(false);
      setIsEditingAdditional(false);
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error: any) => {
      console.log("Erro ao atualizar perfil:", error);
      toast.error(error.message || "Erro ao atualizar perfil");
    },
  });

  const handleSavePersonal = (data: PersonalDataScheme) => {
    updateProfileMutation.mutate({
      userId: "30d453b9-88c9-429e-9700-81d2db735f7a",
      data: {
        name: data.name,
        cpf: data.cpf,
        birthDate: data.birthDate
          ? new Date(data.birthDate).toISOString()
          : undefined,
        phone: data.phone,
      },
    });
  };

  const handleSaveAddress = (data: AddressScheme) => {
    updateProfileMutation.mutate({
      userId: "30d453b9-88c9-429e-9700-81d2db735f7a",
      data: {
        cep: cleanCep(data.cep),
        street: data.street,
        number: data.noNumber ? "S/N" : data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      },
    });
  };

  const handleSaveAdditional = (data: AdicionalDataScheme) => {
    updateProfileMutation.mutate({
      userId: "30d453b9-88c9-429e-9700-81d2db735f7a",
      data: {
        bio: data.bio,
      },
    });
  };

  const handleCancelPersonal = () => {
    if (userAuth) {
      formPersonalData.reset({
        name: userAuth.name || "",
        cpf: userAuth.cpf || "",
        birthDate: userAuth.birthDate
          ? dayjs(userAuth.birthDate).toDate()
          : undefined,
        phone: userAuth.phone || "",
      });
    }
    setIsEditingPersonal(false);
  };

  const handleCancelAddress = () => {
    if (userAuth) {
      formAddress.reset({
        cep: userAuth.cep ? formatCep(userAuth.cep) : "",
        street: userAuth.street || "",
        number: userAuth.number || "",
        noNumber: userAuth.number === "S/N",
        complement: userAuth.complement || "",
        neighborhood: userAuth.neighborhood || "",
        city: userAuth.city || "",
        state: userAuth.state || "",
      });
    }
    setIsEditingAddress(false);
  };

  const handleCancelAdditional = () => {
    if (userAuth) {
      formAdditionalInformation.reset({
        bio: userAuth.bio || "",
      });
    }
    setIsEditingAdditional(false);
  };

  const handleSearchCep = async (cep: string) => {
    if (!cep || cep.length < 8 || isSearchingCep) return;

    setIsSearchingCep(true);
    try {
      const cepData = await fetchCepData(cep);

      if ("erro" in cepData && cepData.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      // Preenche os campos automaticamente
      if ("logradouro" in cepData) {
        formAddress.setValue("street", cepData.logradouro);
        formAddress.setValue("neighborhood", cepData.bairro);
        formAddress.setValue("city", cepData.localidade);
        formAddress.setValue("state", cepData.uf);

        toast.success("Endereço encontrado!");
      }
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsSearchingCep(false);
    }
  };

  const formPersonalData = useForm<PersonalDataScheme>({
    resolver: zodResolver(personalSchema),
  });

  const formAddress = useForm<AddressScheme>({
    resolver: zodResolver(addressSchema),
  });

  const formAdditionalInformation = useForm<AdicionalDataScheme>({
    resolver: zodResolver(adicionalDataSchema),
  });

  const watchedCep = formAddress.watch("cep");

  useEffect(() => {
    if (
      watchedCep &&
      watchedCep.length === 8 &&
      isEditingAddress &&
      !isSearchingCep
    ) {
      const cepField = formAddress.getFieldState("cep");
      if (!cepField.invalid && !cepField.error) {
        const timeoutId = setTimeout(() => {
          handleSearchCep(watchedCep);
        }, 500);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [watchedCep, isEditingAddress, isSearchingCep]);

  useEffect(() => {
    if (userAuth) {
      formPersonalData.reset({
        name: userAuth.name || "",
        cpf: userAuth.cpf || "",
        birthDate: userAuth.birthDate
          ? dayjs(userAuth.birthDate).toDate()
          : undefined,
        phone: userAuth.phone || "",
      });

      formAddress.reset({
        cep: userAuth.cep ? formatCep(userAuth.cep) : "",
        street: userAuth.street || "",
        number: userAuth.number || "",
        noNumber: userAuth.number === "S/N",
        complement: userAuth.complement || "",
        neighborhood: userAuth.neighborhood || "",
        city: userAuth.city || "",
        state: userAuth.state || "",
      });

      formAdditionalInformation.reset({
        bio: userAuth.bio || "",
      });
    }
  }, [userAuth, formPersonalData, formAddress, formAdditionalInformation]);

  if (isLoading) {
    return (
      <div className="dark-glass dark-shadow-sm rounded-xl p-8 text-center">
        <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <User className="dark-text-tertiary" size={32} />
        </div>
        <h3 className="dark-text-primary mb-2 text-xl font-semibold">
          Carregando dados...
        </h3>
        <p className="dark-text-secondary">
          Buscando suas informações pessoais
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="dark-text-primary text-2xl font-bold">
            Dados pessoais
          </h1>
          <p className="dark-text-secondary mt-1">
            Gerencie suas informações pessoais e de contato
          </p>
        </div>
      </div>

      {/* Dados Obrigatórios */}
      <Form {...formPersonalData}>
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="dark-text-primary text-lg font-semibold">
              Dados obrigatórios
            </h3>
            {!isEditingPersonal && (
              <Button
                onClick={() => setIsEditingPersonal(true)}
                className="dark-btn-primary"
                size="sm"
              >
                <Edit size={16} className="mr-2" />
                Editar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={formPersonalData.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Nome *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditingPersonal}
                      className="dark-input"
                      placeholder="Seu nome completo"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formPersonalData.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    CPF *
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        value={formatDocument(field.value)}
                        disabled
                        className="dark-input flex-1"
                        placeholder="000.000.000-00"
                      />
                      {isEditingPersonal && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="dark-border-secondary dark-text-secondary hover:dark-bg-tertiary"
                        >
                          Alterar
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formPersonalData.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Data de nascimento *
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      onSelect={field.onChange}
                      selected={field.value ? new Date(field.value) : undefined}
                      disabled={!isEditingPersonal}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formPersonalData.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Telefone *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditingPersonal}
                      className="dark-input"
                      placeholder="(11) 99999-9999"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEditingPersonal && (
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                onClick={handleCancelPersonal}
                variant="ghost"
                className="dark-text-secondary hover:dark-bg-tertiary"
              >
                <X size={16} className="mr-2" />
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={formPersonalData.handleSubmit(handleSavePersonal)}
                className="dark-btn-primary"
                disabled={updateProfileMutation.isPending}
              >
                <Save size={16} className="mr-2" />
                {updateProfileMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </div>
      </Form>

      {/* Endereço */}
      <Form {...formAddress}>
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="dark-text-primary text-lg font-semibold">
              Endereço
            </h3>
            {!isEditingAddress && (
              <Button
                onClick={() => setIsEditingAddress(true)}
                className="dark-btn-primary"
                size="sm"
              >
                <Edit size={16} className="mr-2" />
                Editar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={formAddress.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    CEP *
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        value={formatCep(field.value || "")}
                        onChange={(e) => {
                          const cleanValue = cleanCep(e.target.value);
                          field.onChange(cleanValue);
                        }}
                        disabled={!isEditingAddress}
                        className="dark-input flex-1"
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formAddress.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Rua *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditingAddress}
                      className="dark-input"
                      placeholder="Nome da rua"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formAddress.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Número *
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        {...field}
                        disabled={
                          !isEditingAddress || formAddress.watch("noNumber")
                        }
                        className="dark-input"
                        placeholder="123"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="noNumber"
                          checked={formAddress.watch("noNumber") || false}
                          onChange={(e) => {
                            formAddress.setValue("noNumber", e.target.checked);
                            if (e.target.checked) {
                              formAddress.setValue("number", "");
                              formAddress.trigger("number");
                            }
                          }}
                          disabled={!isEditingAddress}
                          className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                        />
                        <Label
                          htmlFor="noNumber"
                          className="dark-text-secondary cursor-pointer text-sm"
                        >
                          Sem número
                        </Label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formAddress.control}
              name="complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Complemento
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditingAddress}
                      className="dark-input"
                      placeholder="Apto, casa, etc."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formAddress.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Bairro *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditingAddress}
                      className="dark-input"
                      placeholder="Nome do bairro"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formAddress.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Cidade *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditingAddress}
                      className="dark-input"
                      placeholder="Nome da cidade"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formAddress.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    UF *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditingAddress}
                      className="dark-input"
                      placeholder="SP"
                      maxLength={2}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEditingAddress && (
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                onClick={handleCancelAddress}
                variant="ghost"
                className="dark-text-secondary hover:dark-bg-tertiary"
              >
                <X size={16} className="mr-2" />
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={formAddress.handleSubmit(handleSaveAddress)}
                className="dark-btn-primary"
                disabled={
                  updateProfileMutation.isPending ||
                  !formAddress.formState.isValid
                }
              >
                <Save size={16} className="mr-2" />
                {updateProfileMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </div>
      </Form>

      {/* Informações Adicionais */}
      <Form {...formAdditionalInformation}>
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="dark-text-primary text-lg font-semibold">
              Informações adicionais
            </h3>
            {!isEditingAdditional && (
              <Button
                onClick={() => setIsEditingAdditional(true)}
                className="dark-btn-primary"
                size="sm"
              >
                <Edit size={16} className="mr-2" />
                Editar
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <FormField
              control={formAdditionalInformation.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Biografia
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!isEditingAdditional}
                      className="dark-input resize-none"
                      rows={6}
                      placeholder="Conte um pouco sobre você, sua jornada ministerial e objetivos..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEditingAdditional && (
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                onClick={handleCancelAdditional}
                variant="ghost"
                className="dark-text-secondary hover:dark-bg-tertiary"
              >
                <X size={16} className="mr-2" />
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() =>
                  formAdditionalInformation.handleSubmit(handleSaveAdditional)()
                }
                className="dark-btn-primary"
                disabled={updateProfileMutation.isPending}
              >
                <Save size={16} className="mr-2" />
                {updateProfileMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}
