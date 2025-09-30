"use client";

import {
  ChangeEvent,
  ComponentProps,
  forwardRef,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { cn } from "../lib/utils.ts";
import { Input, InputProps } from "./input.tsx";

type MoneyInputProps = InputProps &
  PropsWithChildren & {
    divClassName?: string;
    labelClassName?: string;
  };

/**
 * Componente MoneyInput otimizado para trabalhar com react-hook-form
 * - Formata valores em moeda brasileira (R$)
 * - Converte automaticamente entre string formatada e valor numérico
 * - Compatível com toLocaleString para formatação consistente
 */

const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onChange, className, divClassName, children, ...props }, ref) => {
    // Estado interno para controlar o que o usuário vê
    const [displayValue, setDisplayValue] = useState<string>("");

    // Função para extrair apenas números de uma string
    const extractNumbers = (str: string): string => {
      return str.replace(/[^\d]/g, "");
    };

    // Função para formatar número para moeda brasileira
    const formatCurrency = (num: number): string => {
      if (isNaN(num) || num === 0) return "";

      return num.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    // Sincroniza com o value prop
    useEffect(() => {
      if (value === undefined || value === null || value === "") {
        setDisplayValue("");
        return;
      }

      const numValue =
        typeof value === "string" ? parseFloat(value) : Number(value);
      setDisplayValue(formatCurrency(numValue));
    }, [value]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      // Se o campo está vazio
      if (!inputValue.trim()) {
        setDisplayValue("");
        onChange?.({
          ...event,
          target: {
            ...event.target,
            value: "",
          },
        });
        return;
      }

      // Extrai apenas números da entrada
      const numbersOnly = extractNumbers(inputValue);

      // Se não há números, limpa o campo
      if (!numbersOnly) {
        setDisplayValue("");
        onChange?.({
          ...event,
          target: {
            ...event.target,
            value: "",
          },
        });
        return;
      }

      // Converte para número (tratando como centavos)
      const numericValue = parseFloat(numbersOnly) / 100;

      // Formata para exibição
      const formattedValue = formatCurrency(numericValue);
      setDisplayValue(formattedValue);

      // Chama onChange com o valor numérico
      onChange?.({
        ...event,
        target: {
          ...event.target,
          value: numericValue.toString(),
        },
      });
    };

    return (
      <div className={cn("flex h-full flex-col", divClassName)}>
        <div className="relative h-full flex">
          {children}
          <Input
            {...props}
            className={cn(className)}
            value={displayValue}
            onChange={handleChange}
            placeholder="R$ 0,00"
            ref={ref}
          />
        </div>
      </div>
    );
  }
);

MoneyInput.displayName = "MoneyInput";

type MoneyInputLabelProps = ComponentProps<"p">;

const MoneyInputLabel = forwardRef<HTMLParagraphElement, MoneyInputLabelProps>(
  ({ className, ...rest }, ref) => {
    return (
      <p
        {...rest}
        className={cn(
          "font-bold text-primary dark:text-dark-primary absolute left-1 top-1/2 -translate-y-1/2 z-50 mr-2 pr-2",
          className
        )}
        ref={ref}
      >
        R$
      </p>
    );
  }
);

MoneyInputLabel.displayName = "MoneyInputLabel";

export { MoneyInput, MoneyInputLabel };
