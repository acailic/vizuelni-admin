import { spawn } from "child_process";
import * as crypto from "crypto";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import { NextApiRequest, NextApiResponse } from "next";

// Allowed locales to prevent injection
const ALLOWED_LOCALES = ["sr", "en", "sr-Cyrl", "sr-Latn"] as const;
type AllowedLocale = (typeof ALLOWED_LOCALES)[number];

// Validate and sanitize locale parameter
function validateLocale(locale: unknown): AllowedLocale {
  if (typeof locale !== "string") return "sr";
  const normalized = locale.trim();
  if (ALLOWED_LOCALES.includes(normalized as AllowedLocale)) {
    return normalized as AllowedLocale;
  }
  return "sr";
}

// Validate maxInsights is a safe integer
function validateMaxInsights(maxInsights: unknown): number {
  if (typeof maxInsights !== "number") return 5;
  const safe = Math.floor(Math.max(1, Math.min(20, maxInsights)));
  return safe;
}

// Create a secure temporary file with random name
function createSecureTempFile(prefix: string, suffix: string): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const randomId = crypto.randomBytes(16).toString("hex");
  return path.join(tempDir, `${randomId}${suffix}`);
}

// Clean up temp directory safely
function cleanupTempDir(filePath: string): void {
  try {
    const dir = path.dirname(filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    if (fs.existsSync(dir) && dir.startsWith(os.tmpdir())) {
      fs.rmdirSync(dir);
    }
  } catch {
    // Ignore cleanup errors
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const tempFilePath = createSecureTempFile("insights-", ".csv");

  try {
    const { data, locale, maxInsights } = req.body;

    if (!data || typeof data !== "string") {
      return res.status(400).json({ error: "No data provided" });
    }

    // Validate and sanitize inputs
    const safeLocale = validateLocale(locale);
    const safeMaxInsights = validateMaxInsights(maxInsights);

    // Write the data to a secure temporary file
    fs.writeFileSync(tempFilePath, data, { mode: 0o600 });

    // Use spawn instead of exec for safer command execution
    const scriptDir = path.join(process.cwd(), "..", "..", "scenarios");
    const pythonProcess = spawn(
      "/usr/bin/python3",
      [
        "-m",
        "dataset_insights.generate_insights",
        "--input",
        tempFilePath,
        "--locale",
        safeLocale,
        "--max-insights",
        String(safeMaxInsights),
      ],
      {
        cwd: scriptDir,
        timeout: 30000,
        env: { ...process.env, PYTHONPATH: scriptDir },
      }
    );

    // Collect stdout and stderr
    let stdout = "";
    let stderr = "";

    pythonProcess.stdout.on("data", (chunk) => {
      stdout += chunk;
    });

    pythonProcess.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    // Wait for process to complete
    const exitCode = await new Promise<number>((resolve, reject) => {
      pythonProcess.on("close", resolve);
      pythonProcess.on("error", reject);
    });

    if (exitCode !== 0) {
      console.error("Python script failed:", stderr);
      return res.status(500).json({
        error: "Failed to analyze data",
        details: stderr || `Process exited with code ${exitCode}`,
      });
    }

    if (stderr.trim()) {
      console.error("Python script stderr:", stderr);
    }

    // Parse the JSON output from the Python script
    const insights = JSON.parse(stdout);

    return res.status(200).json({
      success: true,
      insights,
      count: insights.length,
    });
  } catch (error) {
    console.error("Error analyzing data:", error);

    return res.status(500).json({
      error: "Failed to analyze data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    // Always clean up temp files
    cleanupTempDir(tempFilePath);
  }
}
