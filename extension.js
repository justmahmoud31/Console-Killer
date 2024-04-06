const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.commands.registerCommand('console-killer.justMahmoud', function () {
        let activeTextEditor = vscode.window.activeTextEditor;
        if (activeTextEditor) {
            let file_path = activeTextEditor.document.uri.fsPath;

            vscode.workspace.fs.readFile(vscode.Uri.file(file_path)).then(file_content => {
                file_content = new TextDecoder().decode(file_content);
                let new_file_content = file_content.replace(/console\.log\([^)]*\);?\n?/g, '');
                
                if (new_file_content !== file_content) {
                    vscode.workspace.fs.writeFile(vscode.Uri.file(file_path), Buffer.from(new_file_content, 'utf8')).then(() => {
                        vscode.window.showInformationMessage(`console.log() statements removed from ${file_path}`);
                    }).catch(error => {
                        vscode.window.showErrorMessage("Error writing file: " + error.message);
                    });
                } else {
                    vscode.window.showInformationMessage("All Good, There is no console.log() in your code");
                }
            }).catch(error => {
                vscode.window.showErrorMessage("Error reading file: " + error.message);
            });
        } else {
            vscode.window.showErrorMessage("No active text editor found.");
        }
    });
    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
