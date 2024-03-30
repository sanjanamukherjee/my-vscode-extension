// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { TimerPanel } from "./TimerPanel";
import { SidebarProvider } from "./SidebarProvider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vstimer" is now active!');

  const globalState = context.globalState;

  let keystrokeCount = globalState.get<number>("keystrokeCount") || 0;

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vstimer-sidebar",
      sidebarProvider
    )
  );

  vscode.workspace.onDidChangeTextDocument((event) => {
    // console.log("here onchange -----", event.contentChanges);
    keystrokeCount++;
    sidebarProvider._view?.webview.postMessage({
      type: "onUpdateKeystrokeCount",
      value: keystrokeCount,
    });
  });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("vstimer.helloWorld", () => {
    TimerPanel.createOrShow(context.extensionUri);
  });

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand("vstimer.startTimer", async () => {
      const answer = await vscode.window.showInformationMessage(
        "Shall we start the Timer?",
        "Yes",
        "No"
      );

      if (answer === "No") {
        vscode.window.showInformationMessage("Timer has been cancelled");
      }
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
