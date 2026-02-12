import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as core from "@actions/core";
import * as os from "os";

export interface ToolchainOptions {
    default?: boolean;
    override?: boolean;
    components?: string[];
    profile?: string;
    noSelfUpdate?: boolean;
    allowDowngrade?: boolean;
}

export class RustUp {
    private static instance: RustUp | null = null;

    private constructor(private path: string) {}

    static async getOrInstall(): Promise<RustUp> {
        if (RustUp.instance) {
            return RustUp.instance;
        }

        let rustupPath = await io.which("rustup", false);

        if (!rustupPath) {
            core.info("rustup not found, installing...");
            const platform = os.platform();
            let installerUrl: string;

            if (platform === "darwin") {
                installerUrl = "https://sh.rustup.rs";
            } else if (platform === "win32") {
                installerUrl = "https://win.rustup.rs/x86_64";
            } else {
                installerUrl = "https://sh.rustup.rs";
            }

            // Download and execute rustup installer
            await exec.exec("sh", [
                "-c",
                `curl -fsSL ${installerUrl} | sh -s -- -y --default-toolchain none`,
            ]);

            // Add cargo bin to PATH for subsequent commands
            const cargoPath =
                process.env.HOME ||
                (os.platform() === "win32"
                    ? process.env.USERPROFILE
                    : undefined);
            if (cargoPath) {
                const cargoBin = `${cargoPath}/.cargo/bin`;
                const currentPath = process.env.PATH || "";
                if (!currentPath.includes(cargoBin)) {
                    core.addPath(cargoBin);
                }
            }

            // Try to find rustup again after installation
            rustupPath = await io.which("rustup", true);
        }

        RustUp.instance = new RustUp(rustupPath);
        return RustUp.instance;
    }

    async call(args: string[]): Promise<void> {
        await exec.exec(this.path, args);
    }

    async supportProfiles(): Promise<boolean> {
        try {
            const { stdout } = await this.execCapture(["--version"]);
            const versionMatch = stdout.match(/rustup (\d+\.\d+\.\d+)/);
            if (versionMatch) {
                const major = parseInt(versionMatch[1].split(".")[0], 10);
                return major >= 1;
            }
            return true;
        } catch {
            return false;
        }
    }

    async supportComponents(): Promise<boolean> {
        try {
            const { stdout } = await this.execCapture(["--version"]);
            const versionMatch = stdout.match(/rustup (\d+\.\d+\.\d+)/);
            if (versionMatch) {
                const major = parseInt(versionMatch[1].split(".")[0], 10);
                return major >= 1;
            }
            return true;
        } catch {
            return false;
        }
    }

    private async execCapture(args: string[]): Promise<{ stdout: string }> {
        let stdout = "";
        await exec.exec(this.path, args, {
            listeners: {
                stdout: (data: Buffer) => {
                    stdout += data.toString();
                },
            },
            silent: true,
        });
        return { stdout };
    }

    async selfUpdate(): Promise<void> {
        await this.call(["self", "update"]);
    }

    async setProfile(profile: string): Promise<void> {
        await this.call(["set", "profile", profile]);
    }

    async installToolchain(
        name: string,
        options?: ToolchainOptions,
    ): Promise<void> {
        const args: string[] = ["toolchain", "install", name];

        if (options?.profile) {
            args.push("--profile", options.profile);
        }

        if (options?.components && options.components.length > 0) {
            for (const component of options.components) {
                args.push("-c", component);
            }
        }

        if (options?.allowDowngrade) {
            args.push("--allow-downgrade");
        }

        if (options?.noSelfUpdate) {
            args.push("--no-self-update");
        }

        if (options?.default) {
            args.push("--default");
        }

        await this.call(args);

        if (options?.override) {
            await this.call(["override", "set", name]);
        }
    }

    async addTarget(target: string, toolchain: string): Promise<void> {
        await this.call(["target", "add", target, "--toolchain", toolchain]);
    }
}
