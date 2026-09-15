"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyInstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      className="shrink-0 font-mono"
      onClick={async () => {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy install"}
    </Button>
  );
}
