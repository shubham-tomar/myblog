+++
title = "Flink with nix"
description = "In this blog i share a nix flake setup for flink realtime data streaming"
date = "2025-01-10"
[taxonomies]
tags=["blog"]
+++

# Intorduction

In my current Project i had to work with flink for real time analytics requirements, while there are many ways to setup a develper environment most of the time i prefer going via nix-flake route. If you are someone who is not familiar with nix world, i highly recommend you giving it a chance.


> Note:

# Nix
In a nutshell Nix can be your package manager, functional scripting language, or even OS (nixOS)
you can go to below links to learn in detail

# Template file

- If you have already nix installed and flakes enabled, just run `nix develop`

```nix
{
 description = "nix-template";


 nixConfig.bash-prompt = "[nix]λ ";


 inputs = {
   nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";


   flake-utils = {
     url = "github:numtide/flake-utils";
   };
 };


 outputs = { self, flake-utils, nixpkgs}:
   flake-utils.lib.eachDefaultSystem (system:
     let
       pkgs = import nixpkgs {
         inherit system;
       };
       customFlink = pkgs.stdenv.mkDerivation {
           pname = "flink";
           version = "1.14.4";
           src = pkgs.fetchurl {
           url = "https://downloads.apache.org/flink/flink-1.20.0/flink-1.20.0-bin-scala_2.12.tgz";
           sha256 = "sha256-cI/VRMz53cDUsZL+A1eXzhbeLCbx12TFWQcwXv4UCvA=";
           };
           nativeBuildInputs = [ pkgs.unzip ];
           installPhase = ''
           mkdir -p $out
           tar -xzf $src --strip-components=1 -C $out
           '';
       };
     in {
       # `nix develop`
       devShell = pkgs.mkShell {
           name = "flink-streaming-env";
           buildInputs = [
               pkgs.openjdk17
               pkgs.maven
               customFlink
           ];


           shellHook = ''
               echo "Welcome to the Flink Streaming Development Environment!"
               echo "Java Version:"
               java -version
               export JVM_ARGS="--add-opens=java.base/java.util=ALL-UNNAMED"
           '';
       };


       # `nix build`
       packages.default = pkgs.writeShellScriptBin "run-flink-job" ''
           LOG_DIR=~/flink-logs
           mkdir -p "$LOG_DIR"


           # Set the Flink log directory environment variable
           export FLINK_LOG_DIR="$LOG_DIR"
          
           ${customFlink}/bin/start-cluster.sh
           echo "Running Flink Job..."
           FLINK_BIN=${customFlink}/bin/flink
           FLINK_JAR_PATH=${./flink-streaming-project/target/flink-streaming-project-1.0-SNAPSHOT.jar}
           if [ ! -f "$FLINK_JAR_PATH" ]; then
               echo "Error: Flink JAR file not found at $FLINK_JAR_PATH. Please build the project first."
               exit 1
           fi
           # Execute the Flink job
           export JVM_ARGS="--add-opens=java.base/java.util=ALL-UNNAMED"
           $FLINK_BIN run "$FLINK_JAR_PATH"


           ${customFlink}/bin/stop-cluster.sh
       '';


     }
   );
}
```
## Note
- you might need to change sha 
- First time setup **WILL TAKE TIME**
- This is very basic setup with just java and flink, you can modify/add as per your requirements

# In Closing

- You should be able to run a nix development shell using above template
