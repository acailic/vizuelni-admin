/**
 * Utility functions for running Python scripts from the dataset discovery tool
 */

import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";

export interface PythonExecutionOptions {
  timeout?: number;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  pythonPath?: string;
}

export interface PythonExecutionResult {
  stdout: string;
  stderr: string;
  success: boolean;
  tempFiles?: string[];
}

export class PythonRunner {
  private basePythonPath: string;
  private scenariosCwd: string;

  constructor() {
    // Path to the scenarios directory where dataset_discovery is located
    this.scenariosCwd = path.join(process.cwd(), "..", "..", "scenarios");
    this.basePythonPath = "/usr/bin/python3"; // Default Python path
  }

  /**
   * Validate that a path is safe (no directory traversal)
   */
  private validatePath(pathStr: string): boolean {
    // Reject paths with directory traversal
    if (pathStr.includes("..")) return false;
    // Reject absolute paths outside allowed directories
    if (pathStr.startsWith("/") && !pathStr.startsWith(this.scenariosCwd)) {
      return false;
    }
    return true;
  }

  /**
   * Validate that a string argument is safe (no command injection)
   */
  private validateArg(arg: string): boolean {
    // Allow alphanumeric, dashes, underscores, spaces, and common safe chars
    // Reject shell metacharacters
    const dangerousPattern = /[;&|`$(){}[\]\\<>!]/;
    return !dangerousPattern.test(arg);
  }

  /**
   * Execute the dataset discovery Python script using spawn for safety
   */
  async runDatasetDiscovery(
    args: string[],
    options: PythonExecutionOptions = {}
  ): Promise<PythonExecutionResult> {
    const tempFiles: string[] = [];
    const {
      timeout = 30000,
      cwd = this.scenariosCwd,
      env = process.env,
      pythonPath = this.basePythonPath,
    } = options;

    try {
      // Path to the discover_datasets.py script
      const scriptPath = path.join(
        this.scenariosCwd,
        "dataset_discovery",
        "discover_datasets.py"
      );

      // Validate paths
      if (!this.validatePath(scriptPath)) {
        throw new Error("Invalid script path");
      }

      if (!this.validatePath(pythonPath)) {
        throw new Error("Invalid Python path");
      }

      // Validate all arguments to prevent command injection
      for (const arg of args) {
        if (!this.validateArg(arg)) {
          throw new Error(`Invalid argument: contains dangerous characters`);
        }
      }

      // Build arguments array for spawn (no shell interpolation)
      const spawnArgs = [scriptPath, ...args];

      // Execute the Python script using spawn (safer than exec)
      const pythonProcess = spawn(pythonPath, spawnArgs, {
        cwd,
        env: {
          ...env,
          PYTHONPATH: path.join(this.scenariosCwd, "dataset_discovery"),
        },
        timeout,
      });

      // Collect stdout and stderr
      let stdout = "";
      let stderr = "";

      pythonProcess.stdout.on("data", (chunk) => {
        stdout += chunk;
      });

      pythonProcess.stderr.on("data", (chunk) => {
        stderr += chunk;
      });

      // Wait for process to complete with timeout
      const exitCode = await new Promise<number>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          pythonProcess.kill();
          reject(new Error(`Process timed out after ${timeout}ms`));
        }, timeout);

        pythonProcess.on("close", (code) => {
          clearTimeout(timeoutId);
          resolve(code ?? 1);
        });

        pythonProcess.on("error", (err) => {
          clearTimeout(timeoutId);
          reject(err);
        });
      });

      return {
        stdout,
        stderr,
        success: exitCode === 0,
        tempFiles,
      };
    } catch (error: any) {
      return {
        stdout: error.stdout || "",
        stderr: error.stderr || error.message,
        success: false,
        tempFiles,
      };
    }
  }

  /**
   * Create a temporary file and return its path
   */
  createTempFile(prefix: string, suffix: string = ".json"): string {
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const filename = `${prefix}_${timestamp}_${random}${suffix}`;
    const filePath = path.join(tempDir, filename);

    return filePath;
  }

  /**
   * Clean up temporary files
   */
  cleanupTempFiles(files: string[]): void {
    files.forEach((file) => {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      } catch (error) {
        console.warn(`Failed to cleanup temp file ${file}:`, error);
      }
    });
  }

  /**
   * Search datasets by query or category
   */
  async searchDatasets(options: {
    query?: string;
    category?: string;
    minResults?: number;
    expandDiacritics?: boolean;
    output?: string;
  }): Promise<PythonExecutionResult> {
    const args: string[] = [];
    const tempFiles: string[] = [];

    // Determine search type and build arguments
    if (options.category) {
      // Validate category is alphanumeric + safe chars
      if (!/^[\w\s-]+$/.test(options.category)) {
        throw new Error("Invalid category format");
      }
      args.push("--category", options.category);
    } else if (options.query) {
      // Query will be escaped by runDatasetDiscovery
      args.push("--query", options.query);
      if (!options.expandDiacritics) {
        args.push("--no-expand-diacritics");
      }
    } else {
      throw new Error("Either query or category must be provided");
    }

    // Add output file
    const outputFile = options.output || this.createTempFile("datasets");
    args.push("--output", outputFile);
    tempFiles.push(outputFile);

    // Add minimum results
    if (options.minResults) {
      args.push("--min-results", String(options.minResults));
    }

    const result = await this.runDatasetDiscovery(args, {
      cwd: this.scenariosCwd,
    });

    result.tempFiles = tempFiles;
    return result;
  }

  /**
   * Parse JSON output from Python script
   */
  parseJsonOutput(filePath: string): any[] {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Output file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, "utf8");
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse JSON output: ${error}`);
    }
  }

  /**
   * List available categories from the discovery tool
   */
  async listCategories(): Promise<PythonExecutionResult> {
    return this.runDatasetDiscovery(["--list-categories"]);
  }
}

// Export a singleton instance
export const pythonRunner = new PythonRunner();
