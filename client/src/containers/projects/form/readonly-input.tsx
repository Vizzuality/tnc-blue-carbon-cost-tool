import { Input, InputProps } from "@/components/ui/input";

export default function ReadonlyInput(props: InputProps) {
  return (
    <Input
      className="w-full pr-32 text-muted-foreground"
      disabled
      readOnly
      {...props}
    />
  );
}
