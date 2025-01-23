import Link from "next/link";

import { Button } from "@/components/ui/button";

interface SidebarNavigationProps {
  srOnlyTitle: string;
  items: SidebarNavigationItem[];
  currentSection: string | null;
}

export interface SidebarNavigationItem {
  id: string;
  label: string;
  href: string;
}

export const getSidebarNavItemAriaId = (id: string) => `sidebar-nav-${id}-link`;

export default function SidebarNavigation({
  srOnlyTitle,
  items,
  currentSection,
}: SidebarNavigationProps) {
  return (
    <nav className="flex-1" aria-labelledby="sidebar-nav-title">
      <h2 id="sidebar-nav-title" className="sr-only">
        {srOnlyTitle}
      </h2>
      <ul role="list" className="space-y-2">
        {items.map((o) => (
          <li key={`section-link-${o.id}`} role="listitem">
            <Button
              variant={currentSection === o.id ? "default" : "ghost"}
              asChild
              className="w-full justify-start font-medium"
            >
              <Link
                href={o.href}
                id={getSidebarNavItemAriaId(o.id)}
                aria-controls={o.id}
                aria-current={currentSection === o.id ? "true" : undefined}
              >
                {o.label}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
