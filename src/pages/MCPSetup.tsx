import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Terminal } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getMe } from "@/lib/api/auth";

const MCPSetup = () => {
  const [copied, setCopied] = useState(false);
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const tenantId = data?.tenant.id ?? "<tenant-id>";

  const mcpConfig = {
    mcpServers: {
      [`goai-workflow-${tenantId}`]: {
        command: "python",
        args: ["-m", "goai_mcp.server"],
        cwd: "/not-used-if-you-wrap-with-http",
        transport: "http",
        endpoint: `https://mcp.yourdomain.com/${tenantId}`,
      },
    },
  };

  const configStr = JSON.stringify(mcpConfig, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(configStr);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">MCP / Cursor Setup</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure Cursor IDE to use GoAI workflows via MCP
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              MCP Configuration
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Add this to your{" "}
            <code className="text-primary font-mono text-xs">.cursor/mcp.json</code> file:
          </p>
          <pre className="rounded-lg bg-background border p-4 font-mono text-xs overflow-x-auto text-foreground">
            {configStr}
          </pre>
        </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                1
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Copy the config above</p>
                <p className="text-xs text-muted-foreground">
                  Add it to <code className="text-primary">.cursor/mcp.json</code> in your project root.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                2
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Restart Cursor</p>
                <p className="text-xs text-muted-foreground">
                  The MCP server will be available after restart.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                3
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Use in chat</p>
                <p className="text-xs text-muted-foreground">
                  Example: "Run the Jira to PR workflow for this ticket: PAY-123"
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Available MCP Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: "wr_jira_issue_to_pr", desc: "Full Jira ticket → PR workflow" },
              { name: "wr_linear_issue_to_pr", desc: "Full Linear issue → PR workflow" },
              { name: "step_generate_prd", desc: "Generate PRD Lite from ticket" },
              { name: "step_navigate_repo", desc: "Scan repo for relevant files" },
              { name: "step_create_plan", desc: "Create implementation plan" },
              { name: "step_implement", desc: "Apply code changes" },
            ].map((tool) => (
              <div key={tool.name} className="flex items-center gap-3 rounded-md bg-muted p-2.5">
                <code className="text-xs font-mono text-primary">{tool.name}</code>
                <span className="text-xs text-muted-foreground">{tool.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MCPSetup;

