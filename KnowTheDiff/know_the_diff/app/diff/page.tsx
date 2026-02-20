'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DiffViewerPage from "@/components/DiffViewer/index";
import { useDiffExists } from "@/hooks/useDiff";

/**
 * `/diff` page — renders the diff viewer.
 *
 * If there is no diff result in the store (e.g. direct navigation),
 * the user is redirected back to the home page.
 */
export default function DiffPage() {
  const router = useRouter();
  const hasDiff = useDiffExists();

  useEffect(() => {
    if (!hasDiff) {
      router.replace("/");
    }
  }, [hasDiff, router]);

  if (!hasDiff) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <DiffViewerPage />
    </main>
  );
}

