# Symlink Replacer

A VS Code extension that helps you manage and replace symbolic links in your workspace with their actual content.

## Features

- Detects symbolic links in your workspace
- Provides commands to replace symlinks with their actual target content
- Supports both file and directory symlinks
- Preserves original file permissions and timestamps
- Batch processing capability for multiple symlinks

## Installation

Install this extension from the VS Code marketplace or download and install the VSIX file manually.

## Usage

1. Open a workspace containing symbolic links
2. Access the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Search for "Symlink Replacer" commands:
   - `Symlink Replacer: Replace Single Symlink` - Replace currently selected symlink
   - `Symlink Replacer: Replace All Symlinks` - Replace all symlinks in workspace

## Extension Settings

This extension contributes the following settings:

* `symlinkReplacer.preserveTimestamps`: Enable/disable preservation of original file timestamps (default: `true`)
* `symlinkReplacer.backupOriginal`: Create backup of original symlinks before replacing (default: `false`)

## Requirements

- VS Code 1.60.0 or higher
- File system permissions to modify symlinks

## Known Issues

- Currently does not support replacing symlinks that point to locations outside the workspace
- May require elevated permissions on some systems

## Release Notes

### 0.0.2
- Added support for replacing symlinks inside folders
- Fixed file symlink replacement issues
- Improved folder handling and recursive replacement

### 0.0.1
- Initial release
- Basic symlink replacement functionality
- Workspace-wide scanning and replacement
- Settings for timestamp preservation

## Contributing

Found a bug or want to contribute? Visit our [GitHub repository](https://github.com/williammanco/symlink-replacer-vscode).

## License

This extension is licensed under the [MIT License](https://opensource.org/license/mit).
