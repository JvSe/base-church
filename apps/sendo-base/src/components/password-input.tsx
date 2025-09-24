"use client";

import { Input } from "@base-church/ui/components/input";
import { Eye, EyeOff } from "lucide-react";
import { ForwardRefRenderFunction, forwardRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type IPasswordInput = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: boolean;
};

const PasswordInputRef: ForwardRefRenderFunction<
  HTMLInputElement,
  IPasswordInput
> = ({ leftIcon = true, ...rest }, ref) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <div
      aria-invalid={rest["aria-invalid"]}
      className={twMerge("relative flex rounded-lg", rest.className)}
    >
      <Input type={show ? "text" : "password"} ref={ref} {...rest} />
      <div className="absolute right-0 bottom-0 h-full w-[3rem]">
        <div
          onClick={handleClick}
          className="dark:text-dark-4 flex h-full items-center justify-center"
        >
          {!show ? <Eye /> : <EyeOff />}
        </div>
      </div>
    </div>
  );
};

export const PasswordInput = forwardRef(PasswordInputRef);
