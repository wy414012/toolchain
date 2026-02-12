import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as core from "@actions/core";
import * as os from "os";

export interface ToolchainOptions {
    default?: boolean;
    override?: boolean;
    components?: string[];
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

            await exec.exec(
                "sh",
                ["-s", "--", "-y", "--default-toolchain", "none"],
                {
                    input: Buffer.from(`curl -fsSL ${installerUrl}`),
                },
            );

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
            await exec.exec(this.path, ["set", "profile", "help"], {
                silent: true,
                ignoreReturnCode: true,
            });
            return true;
        } catch {
            return false;
        }
    }

    async supportComponents(): Promise<boolean> {
        try {
            await exec.exec(this.path, ["component", "help"], {
                silent: true,
                ignoreReturnCode: true,
            });
            return true;
        } catch {
            return false;
        }
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
        const args: string[] = ["install", name];

        if (options?.default) {
            args.push("--default");
        }

        if (options?.components && options.components.length > 0) {
            args.push("--component", ...options.components);
        }

        if (options?.allowDowngrade) {
            args.push("--force");
        }

        if (options?.noSelfUpdate) {
            // rustup install doesn't have a no-self-update flag
            // this is handled by calling selfUpdate separately when needed
        }

        if (options?.override) {
            // Override is set via directory, not via install command
            // This will be handled separately
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
