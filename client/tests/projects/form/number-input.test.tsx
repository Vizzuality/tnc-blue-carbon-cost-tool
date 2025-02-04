import { ReactNode } from "react";

import { useForm, FormProvider } from "react-hook-form";

import { fireEvent, render } from "@testing-library/react";

import NumberInput, {
  NumberInputProps,
} from "@/containers/projects/form/number-input";

const Wrapper = ({ children }: { children: ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("projects/form/number-input", () => {
  const defaultProps: NumberInputProps = {
    name: "test",
    label: "Test label",
    tooltip: {
      title: "Test title",
      content: "Test content",
    },
  };

  it("renders correctly with default props", () => {
    const { container } = render(
      <Wrapper>
        <NumberInput {...defaultProps} />
      </Wrapper>,
    );

    expect(container).toHaveTextContent(defaultProps.label);
  });

  it("renders with initial value", () => {
    const initialValue = 100;
    const { container } = render(
      <Wrapper>
        <NumberInput {...defaultProps} initialValue={initialValue} />
      </Wrapper>,
    );

    expect(container.querySelector("input")).toHaveValue(initialValue);
  });

  it("renders initial value as whole percentage value when isPercentage is true", () => {
    const decimalValue = 0.5;
    const { container } = render(
      <Wrapper>
        <NumberInput
          {...defaultProps}
          initialValue={decimalValue}
          isPercentage
        />
      </Wrapper>,
    );

    expect(container.querySelector("input")).toHaveValue(decimalValue * 100);
  });

  it("renders with placeholder", () => {
    const placeholder = "Insert a value";
    const { container } = render(
      <Wrapper>
        <NumberInput {...defaultProps} placeholder={placeholder} />
      </Wrapper>,
    );

    expect(container.querySelector("input")).toHaveAttribute(
      "placeholder",
      placeholder,
    );
  });

  it("calls onValueChange with correct value when input value changes", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Wrapper>
        <NumberInput
          {...defaultProps}
          formControlClassName="after:content-['%']"
          onValueChange={onValueChange}
        />
      </Wrapper>,
    );

    const input = container.querySelector("input");

    if (!input) {
      throw new Error("Input not found");
    }

    fireEvent.change(input, { target: { value: "100" } });
    expect(onValueChange).toHaveBeenCalledWith(100);

    fireEvent.change(input, { target: { value: "" } });
    expect(onValueChange).toHaveBeenCalledWith(null);
  });
});
