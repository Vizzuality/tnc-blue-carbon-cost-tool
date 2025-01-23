import { useEffect, RefObject, DependencyList } from "react";

interface UseScrollSpyProps<T> {
  /**
   * The id of the inner container that contains the sections to spy on.
   */
  id: string;
  /**
   * The ref of the outer (scrollable) container that contains the sections to spy on.
   */
  containerRef: RefObject<HTMLElement>;
  /**
   * The function to set the current step.
   */
  setCurrentStep: (value: T) => void;
  /**
   * The options for the IntersectionObserver.
   */
  options?: {
    threshold?: number;
    rootMargin?: string;
  };
  /**
   * The dependencies to watch for changes.
   */
  deps?: DependencyList;
}

export function useScrollSpy<T>({
  id,
  containerRef,
  setCurrentStep,
  options = {},
  deps = [],
}: UseScrollSpyProps<T>) {
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionSlug = entry.target.id as T;
            setCurrentStep(sectionSlug);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: options.threshold,
        rootMargin: options.rootMargin,
      },
    );

    const sections = Array.from(
      containerRef.current.querySelector(`#${id}`)?.children || [],
    );
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [
    id,
    containerRef,
    setCurrentStep,
    options.threshold,
    options.rootMargin,
    deps,
  ]);
}
