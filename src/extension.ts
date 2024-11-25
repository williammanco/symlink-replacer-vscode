import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

async function copyRecursively(sourcePath: string, targetPath: string) {
    const stats = fs.lstatSync(sourcePath);
    
    if (stats.isDirectory()) {
        // Create the directory if it doesn't exist
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath);
        }
        
        // Copy all contents recursively
        const files = fs.readdirSync(sourcePath);
        for (const file of files) {
            const srcPath = path.join(sourcePath, file);
            const tgtPath = path.join(targetPath, file);
            await copyRecursively(srcPath, tgtPath);
        }
    } else {
        // Copy file
        fs.copyFileSync(sourcePath, targetPath);
    }
}

// Add this new function to check for symlinks recursively
async function hasSymlinksInside(folderPath: string): Promise<boolean> {
    const items = fs.readdirSync(folderPath);
    
    for (const item of items) {
        const fullPath = path.join(folderPath, item);
        const stats = fs.lstatSync(fullPath);
        
        if (stats.isSymbolicLink()) {
            return true;
        }
        
        if (stats.isDirectory()) {
            const hasNestedSymlinks = await hasSymlinksInside(fullPath);
            if (hasNestedSymlinks) {
                return true;
            }
        }
    }
    
    return false;
}

// Add function to recursively replace symlinks in a directory
async function replaceSymlinksInDirectory(dirPath: string) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stats = fs.lstatSync(fullPath);
        
        if (stats.isSymbolicLink()) {
            // Handle symlink
            const realPath = fs.realpathSync(fullPath);
            // Remove symlink
            fs.unlinkSync(fullPath);
            // Copy contents
            await copyRecursively(realPath, fullPath);
        } else if (stats.isDirectory()) {
            // Recursively process subdirectories
            await replaceSymlinksInDirectory(fullPath);
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'symlink-replacer.replaceSymlink',
        async (uri: vscode.Uri) => {
            try {
                const symlinkPath = uri.fsPath;
                console.log('Selected path:', symlinkPath);

                const stats = fs.lstatSync(symlinkPath);
                const realPath = fs.realpathSync(symlinkPath);
                const isSymlink = realPath !== symlinkPath;

                if (!isSymlink && stats.isDirectory()) {
                    // Check if directory has any symlinks
                    const hasSymlinks = await hasSymlinksInside(symlinkPath);
                    if (!hasSymlinks) {
                        vscode.window.showErrorMessage('No symlinks found in the selected folder.');
                        return;
                    }
                    // Replace all symlinks in directory
                    await replaceSymlinksInDirectory(symlinkPath);
                } else if (isSymlink) {
                    // Handle single symlink - Important: Copy first, then remove symlink
                    const tempPath = symlinkPath + '.temp';
                    await copyRecursively(realPath, tempPath);
                    fs.unlinkSync(symlinkPath);
                    fs.renameSync(tempPath, symlinkPath);
                } else {
                    vscode.window.showErrorMessage('The selected item is not a symlink.');
                    return;
                }

                vscode.window.showInformationMessage(
                    `Successfully replaced all symlinks in ${path.basename(symlinkPath)}.`
                );
            } catch (error) {
                console.error('Error:', error);
                vscode.window.showErrorMessage(`Failed to replace symlinks: ${error || 'Unknown error'}`);
            }
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
