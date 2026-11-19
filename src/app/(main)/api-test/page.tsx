"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function ApiTestPage() {
  const [result, setResult] = useState("Click a button to test");

  async function testRoute(path: string) {
    setResult("Loading...");

    try {
      const data = await apiFetch(path);
      setResult("SUCCESS\n" + JSON.stringify(data, null, 2));
    } catch (error) {
      const err = error as Error;
      setResult("ERROR: " + err.message);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold">JWT Middleware Test</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => testRoute("/api/test/me")}>Any user</Button>
        <Button onClick={() => testRoute("/api/test/student")}>Student</Button>
        <Button onClick={() => testRoute("/api/test/tutor")}>Tutor</Button>
        <Button onClick={() => testRoute("/api/test/admin")}>Admin</Button>
      </div>

      <pre className="mt-6 overflow-x-auto rounded-xl border bg-card p-4 text-sm">
        {result}
      </pre>
    </div>
  );
}