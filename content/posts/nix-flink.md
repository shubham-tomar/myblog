+++
title = "Apache Flink with Nix Flakes for Real-Time Data Streaming"
description = "A guide to configuring a Nix flake environment for Apache Flink, enabling efficient real-time data streaming and processing."
date = "2025-01-10"
[taxonomies]
tags = ["blog", "Flink", "Nix"]
+++

# Introduction

In my current project, I worked with <a rel="me noopener noreferrer" target="_blank" href="https://flink.apache.org/">Apache Flink</a> for real-time analytics requirements. While there are various ways to set up a development environment, I prefer using Nix flakes. If you're not familiar with the Nix ecosystem, I highly recommend exploring it. Flink is a powerful stream processing framework designed for low-latency, high-throughput, and stateful computations, making it ideal for real-time analytics.

Setting up a consistent and reproducible development environment for Flink can be challenging due to its dependencies. This is where <a rel="me noopener noreferrer" target="_blank" href="https://nixos.org/">Nix</a>, a functional package manager, excels by providing declarative and reliable environment configurations. Utilizing Nix flakes, an experimental feature (but it is quite stable) that offers a standardized way to define and manage Nix projects.

In this guide, I'll walk you through setting up a Nix flake environment tailored for Apache Flink, facilitating efficient real-time data streaming and processing.

> **Note:** This setup assumes you have Nix installed with flakes enabled. If not, refer to the [Nix installation guide](https://nixos.org/download.html) and [flake documentation](https://nixos.wiki/wiki/Flakes). Or for a shortcut go with <a href="https://determinate.systems/posts/determinate-nix-installer/">Determinate Nix Installer</a>


# Brief about Nix and Flakes

Nix is a powerful package manager that enables reproducible builds and declarative configurations. It can function as a package manager, a functional scripting language, or even as an operating system (NixOS). Nix ensures that your development environment is consistent across different systems, eliminating the "it works on my machine" problem.

Nix flakes introduce a standardized and declarative way to define and manage Nix projects, packages, dependencies, and development environments. They simplify the packaging, versioning, and sharing of Nix projects by encapsulating them into well-structured, self-contained units of code or configuration.

# Setting Up the Nix Flake for Apache Flink

To set up your development environment with Nix flakes, follow these steps:

1. **Install Nix:** If you haven't installed Nix yet, Use below command to install nix and enable flakes in your system, this might take sometime though
```
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
```

3. **Create a New Directory for Your Project:** Open your terminal and execute:

```bash
mkdir flink-nix-setup
cd flink-nix-setup
```
4. **Initialize a New Flake:** Run the following command to create a new flake:

```bash
nix flake init -t github:the-nix-way/dev-templates#default
```
This command initializes your project with a template that includes a flake.nix file, which you can customize to suit your needs.

5. **Configure the flake.nix File:** Replace the contents of the flake.nix file with the following configuration:
- I have added flink, jdk and maven for building java projects but you can add as many pkgs as you need.

```nix
{
  description = "Apache Flink Development Environment with Nix Flakes";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, flake-utils, nixpkgs }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        customFlink = pkgs.stdenv.mkDerivation {
          pname = "flink";
          version = "1.14.4";
          src = pkgs.fetchurl {
            url = "https://downloads.apache.org/flink/flink-1.14.4/flink-1.14.4-bin-scala_2.12.tgz";
            sha256 = "sha256-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
          };
          nativeBuildInputs = [ pkgs.unzip ];
          installPhase = ''
            mkdir -p $out
            tar -xzf $src --strip-components=1 -C $out
          '';
        };
      in {
        devShell = pkgs.mkShell {
          name = "flink-streaming-env";
          buildInputs = [
            pkgs.openjdk17
            pkgs.maven
            customFlink
          ];

          shellHook = ''
            echo "Welcome to the Flink Streaming Development Environment!"
            java -version
            export JVM_ARGS="--add-opens=java.base/java.util=ALL-UNNAMED"
          '';
        };

        packages.default = pkgs.writeShellScriptBin "run-flink-job" ''
          LOG_DIR=~/flink-logs
          mkdir -p "$LOG_DIR"

          export FLINK_LOG_DIR="$LOG_DIR"

          ${customFlink}/bin/start-cluster.sh
          echo "Running Flink Job..."
          FLINK_BIN=${customFlink}/bin/flink
          FLINK_JAR_PATH=./flink-streaming-project/target/flink-streaming-project-1.0-SNAPSHOT.jar
          if [ ! -f "$FLINK_JAR_PATH" ]; then
            echo "Error: Flink JAR file not found at $FLINK_JAR_PATH. Please build the project first."
            exit 1
          fi
          export JVM_ARGS="--add-opens=java.base/java.util=ALL-UNNAMED"
          $FLINK_BIN run "$FLINK_JAR_PATH"

          ${customFlink}/bin/stop-cluster.sh
        '';
      }
    );
}

```

> **Important:** Update the sha256 value with the correct hash for the Flink binary. You can obtain this by downloading the file and running or you can just to `nix develop` and nix will tell you the correct one to use.

- After setting up your flake.nix file you can run the command `nix develop` which will download all the pkgs and will provide you a dev shell.
- Note that running nix for the first time for any project might take some time, so be a little paitient

# Conclusion
I hope after this you will be able to set a nix dev shell which will have flink, jdk, maven included. Fell free to add/modify this tempalte as per your need.

