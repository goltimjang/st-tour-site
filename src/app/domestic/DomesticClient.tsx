"use client";

import { useState } from "react";
import QuoteForm from "@/components/QuoteForm";
import CourseExplorer from "@/components/CourseExplorer";

export default function DomesticClient() {
  const [prefill, setPrefill] = useState<{ course: string; region: string } | null>(null);

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div id="quote" className="scroll-mt-24">
        <QuoteForm
          key={prefill ? prefill.course : "blank"}
          type="domestic"
          prefillCourse={prefill?.course}
          prefillRegion={prefill?.region}
        />
      </div>
      <CourseExplorer
        onPick={(c) => {
          setPrefill({ course: c.name, region: c.region });
          document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}
