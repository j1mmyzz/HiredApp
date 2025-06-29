import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, type LucideIcon } from "lucide-react";
import type { ElementType } from "react";

export interface JobCategory {
  name: string;
  slug: string;
  Icon: LucideIcon | ElementType;
}

export function JobCategoryCard({ category }: { category: JobCategory }) {
  const { name, slug, Icon } = category;

  return (
    <Link href={`/interview/${slug}`} className="group">
      <Card className="hover:border-primary hover:shadow-lg transition-all duration-300 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-4">
            <Icon className="h-8 w-8 text-primary" />
            <CardTitle className="text-xl font-semibold font-headline">{name}</CardTitle>
          </div>
          <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform duration-300" />
        </CardHeader>
      </Card>
    </Link>
  );
}
