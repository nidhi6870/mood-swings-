import * as vscode from 'vscode';

// List of funny error messages
const fakeErrorMessages = [
    "Ha ha! Your code is wrong... just kidding! Or am I?",
    "This would never work in production!",
    "Error: Too much awesome in this code",
    "Syntax error: Your code smells funny",
    "Compilation failed: Did you even try?",
    "Unexpected token: Expected more pizza",
    "ReferenceError: Common sense not found",
    "TypeError: Too beautiful to compile",
    "404: Talent not found in this code",
    "Runtime error: Computer says no",
    "Virus detected: Too much perfection!",
    "Error 911: Code too powerful",
    "Stack overflow: Your awesomeness overflowed",
    "Memory leak: Genius detected",
    "Quantum error: Code exists in multiple states"
];

export function activate(context: vscode.ExtensionContext) {
    // 1. VERIFICATION MESSAGE (appears in Debug Console)
    console.log("🎉 Fake Error Extension ACTIVATED!");
    
    // 2. POPUP CONFIRMATION (appears in VS Code)
    vscode.window.showInformationMessage('Fake errors activated! Prank time! 🎭');
    
    // Create a diagnostic collection for our fake errors
    const diagCollection = vscode.languages.createDiagnosticCollection('useless');
    
    // Function to add fake errors
    const updateDiagnostics = (document: vscode.TextDocument) => {
        // Support more file types
        const supportedLanguages = [
            'html', 'javascript', 'typescript',
            'css', 'python', 'json', 'markdown'
        ];
        
        if (supportedLanguages.includes(document.languageId)) {
            const diagnostics: vscode.Diagnostic[] = [];
            
            // Add 3-5 random fake errors
            const errorCount = Math.floor(Math.random() * 3) + 2;
            
            for (let i = 0; i < errorCount; i++) {
                // Ensure valid line number
                const line = document.lineCount > 0 
                    ? Math.floor(Math.random() * document.lineCount) 
                    : 0;
                
                // Get message and ensure valid range
                const message = fakeErrorMessages[Math.floor(Math.random() * fakeErrorMessages.length)];
                const lineText = document.lineAt(line).text;
                const rangeEnd = Math.min(10, lineText.length);
                
                const range = new vscode.Range(
                    new vscode.Position(line, 0),
                    new vscode.Position(line, rangeEnd)
                );
                
                const diagnostic = new vscode.Diagnostic(
                    range,
                    message,
                    vscode.DiagnosticSeverity.Error
                );
                
                // Add source for better visibility
                diagnostic.source = 'useless-validator';
                
                diagnostics.push(diagnostic);
            }
            
            diagCollection.set(document.uri, diagnostics);
        }
    };
    
    // Check active text editor when extension starts
    if (vscode.window.activeTextEditor) {
        updateDiagnostics(vscode.window.activeTextEditor.document);
    }
    
    // Subscribe to document changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => {
            updateDiagnostics(e.document);
        })
    );
    
    // Subscribe to when the active editor changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                updateDiagnostics(editor.document);
            }
        })
    );
    
    // Add command to force reload errors
    context.subscriptions.push(
        vscode.commands.registerCommand('useless-validator.reload', () => {
            if (vscode.window.activeTextEditor) {
                updateDiagnostics(vscode.window.activeTextEditor.document);
                vscode.window.showInformationMessage('Fake errors reloaded!');
            }
        })
    );
}

export function deactivate() {
    console.log("👋 Fake Error Extension DEACTIVATED!");
}