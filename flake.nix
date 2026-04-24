{
  description = "Bookmarklet development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_24
            pnpm
            biome
            prettier
          ];

          shellHook = ''
            echo "Bookmarklet development environment loaded!"
            echo "Node version: $(node --version)"
            echo "pnpm version: $(pnpm --version)"
          '';
        };
      }
    );
}
