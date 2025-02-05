import { ReactNode } from "react";

import { useForm, FormProvider } from "react-hook-form";

import { fireEvent, render } from "@testing-library/react";

import NumberFormItem, {
  NumberFormItemProps,
} from "@/containers/projects/form/number-form-item";

import { FormField } from "@/components/ui/form";

const Wrapper = ({ children }: { children: ReactNode }) => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <FormField name="test" render={() => <>{children}</>} />
    </FormProvider>
  );
};

describe("projects/form/number-form-item", () => {
  const defaultProps: NumberFormItemProps = {
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
        <NumberFormItem {...defaultProps} />
      </Wrapper>,
    );

    expect(container).toHaveTextContent(defaultProps.label);
  });

  it("renders with initial value", () => {
    const initialValue = 100;
    const { container } = render(
      <Wrapper>
        <NumberFormItem {...defaultProps} initialValue={initialValue} />
      </Wrapper>,
    );

    expect(container.querySelector("input")).toHaveValue(initialValue);
  });

  it("renders initial value as whole percentage value when isPercentage is true", () => {
    const decimalValue = 0.5;
    const { container } = render(
      <Wrapper>
        <NumberFormItem
          {...defaultProps}
          initialValue={decimalValue}
          isPercentage
        />
      </Wrapper>,
    );

    expect(container.querySelector("input")).toHaveValue(decimalValue * 100);
  });

  it("renders with default placeholder when no placeholder is provided", () => {
    const { container } = render(
      <Wrapper>
        <NumberFormItem {...defaultProps} />
      </Wrapper>,
    );

    expect(container.querySelector("input")).toHaveAttribute(
      "placeholder",
      "Insert value",
    );
  });

  it("renders with custom placeholder when provided", () => {
    const customPlaceholder = "My custom placeholder";
    const { container } = render(
      <Wrapper>
        <NumberFormItem {...defaultProps} placeholder={customPlaceholder} />
      </Wrapper>,
    );

    expect(container.querySelector("input")).toHaveAttribute(
      "placeholder",
      customPlaceholder,
    );
  });

  it("calls onValueChange with correct value when input value changes", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Wrapper>
        <NumberFormItem
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
