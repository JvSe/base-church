"use client";

import * as React from "react";

import { Calendar } from "@base-church/ui/components/calendar";
import { Input } from "@base-church/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@base-church/ui/components/popover";
import { ptBR } from "date-fns/locale";
import { Matcher } from "react-day-picker";
import { useBoolean } from "usehooks-ts";
import { useForwardRef } from "../hooks/use-forward-ref.ts";
import { dayjs } from "../lib/dayjs.ts";
import { formatBirthday } from "../lib/helpers/format-birthday.helper.ts";
import { cn } from "../lib/utils.ts";

type DatePickerProps = React.InputHTMLAttributes<HTMLInputElement> & {
  selected: Date | undefined;
  onSelect(date: Date): void;
  leftIcon?: boolean;
  variant?: "default" | "glassmorphism";
  triggerStyle?: string;
  disabledDate?: Matcher | Matcher[];
};

const DatePickerRef: React.ForwardRefRenderFunction<
  HTMLInputElement,
  DatePickerProps
> = (
  {
    selected,
    onSelect,
    leftIcon = true,
    variant = "default",
    className,
    triggerStyle,
    disabledDate,
    ...rest
  },
  ref
) => {
  const [dateTextInput, setDateText] = React.useState<string | undefined>(
    undefined
  );
  const { value: isOpen, setFalse, setTrue } = useBoolean();

  const inputRef = useForwardRef<HTMLInputElement>(ref);

  const handleInputChange = (e: any) => {
    setDateText(e.target.value);
    let textInputToFormat = e.target.value;

    let containBar = (e.target.value as string).includes("/");

    const dateInEnFormat = e.target.value.split(containBar ? "/" : "-");
    if (dateInEnFormat[0].length === 4) {
      textInputToFormat = `${dateInEnFormat[2]}/${dateInEnFormat[1]}/${dateInEnFormat[0]}`;
    }

    const date = formatBirthday(textInputToFormat);

    setDateText(date);
    const valueFormattedToDate = textInputToFormat
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d{2})(\d{4})/, "$3-$2-$1");

    if (date.length > 9) {
      onSelect(dayjs(valueFormattedToDate).toDate());
    }
  };

  const handleSelectDay = React.useCallback(
    (e: any) => {
      onSelect(e);
      setDateText(dayjs(e).format("DD/MM/YYYY"));
      setFalse();
    },
    [onSelect, setFalse] // Mantenha apenas as dependências necessárias
  );

  React.useEffect(() => {
    if (selected) {
      setDateText(dayjs(selected).format("DD/MM/YYYY"));
    } else {
      setDateText("");
    }
  }, [selected]);

  return (
    <Popover open={isOpen}>
      <div className={cn("relative h-full w-full", triggerStyle)}>
        <PopoverTrigger
          onFocus={() => inputRef.current.focus()}
          onFocusCapture={() => inputRef.current.focus()}
          onClick={setTrue}
          disabled={rest.disabled}
          className="w-full"
        >
          <Input
            {...rest}
            placeholder="Data de nascimento"
            className={cn("placeholder:text-sm w-full", className)}
            maxLength={10}
            value={dateTextInput}
            ref={inputRef}
            onChange={(e) => handleInputChange(e)}
          />
        </PopoverTrigger>
      </div>

      <PopoverContent
        onPointerDownOutside={setFalse}
        onEscapeKeyDown={setFalse}
        className="-ml-[290px] mt-[12px] bg-white p-0 dark:dark-glass"
      >
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelectDay as unknown as any}
          locale={ptBR}
          disabled={disabledDate}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
};

export const DatePicker = React.forwardRef(DatePickerRef);
