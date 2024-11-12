import { InputHTMLAttributes, forwardRef } from "react";

import { MailIcon } from "lucide-react";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EmailInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  (
    { label = "Email", placeholder = "Enter your email address", ...props },
    ref,
  ) => {
    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <MailIcon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <Input
              type="email"
              ref={ref}
              className="pl-10"
              placeholder={placeholder}
              {...props}
            />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  },
);

EmailInput.displayName = "EmailInput";

export default EmailInput;
