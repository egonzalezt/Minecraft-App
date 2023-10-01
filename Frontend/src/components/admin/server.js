import React, {useContext} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'; // Import Box component from Mui
import RconApi from '../../services/rcon';
import { useTranslation } from 'react-i18next';
import { TerminalContextProvider } from "react-terminal-es";
import { ReactTerminal, TerminalContext } from "react-terminal-es";

function Server() {
  const { t } = useTranslation();

  const Content = () => {
    const {
      setBufferedContent,
      setCurrentText,
      setProcessCurrentLine,
      setCaretPosition,
      setBeforeCaretText,
      setAfterCaretText,
      editorInput, setEditorInput,
    } = useContext(TerminalContext)
    const [theme, setTheme] = React.useState("matrix");
    const [controlBar, setControlBar] = React.useState(true);
    const [controlButtons, setControlButtons] = React.useState(true);
    const [prompt, setPrompt] = React.useState(">>>");
  
    const commands = {
      help: (
        <span>
          <strong>clear</strong> - clears the console. <br />
          <strong>change_prompt &lt;PROMPT&gt;</strong> - Change the prompt of the
          terminal. <br />
          <strong>change_theme &lt;THEME&gt;</strong> - Changes the theme of the
          terminal. Allowed themes - light, dark, material-light, material-dark,
          material-ocean, matrix and dracula. <br />
          <strong>toggle_control_bar</strong> - Hides / Display the top control
          bar. <br />
          <strong>toggle_control_buttons</strong> - Hides / Display the top
          buttons on control bar. <br />
          <strong>evaluate_math_expression &lt;EXPR&gt;</strong> - Evaluates a
          mathematical expression (eg, <strong>4*4</strong>) by hitting a public
          API, api.mathjs.org.
          <strong>mine_help</strong> - Get minecraft help commands <br />
          <strong>m &lt;PROMPT&gt;</strong> run a minecraft server command<br />
        </span>
      ),
  
      change_prompt: (prompt) => {
        setPrompt(prompt);
      },
  
      change_theme: (theme) => {
        const validThemes = [
          "light",
          "dark",
          "material-light",
          "material-dark",
          "material-ocean",
          "matrix",
          "dracula",
        ];
        if (!validThemes.includes(theme)) {
          return `Theme ${theme} not valid. Try one of ${validThemes.join(", ")}`;
        }
        setTheme(theme);
      },
  
      toggle_control_bar: () => {
        setControlBar(!controlBar);
      },
  
      toggle_control_buttons: () => {
        setControlButtons(!controlButtons);
      },
  
      evaluate_math_expression: async (expr) => {
        const response = await fetch(
          `https://api.mathjs.org/v4/?expr=${encodeURIComponent(expr)}`
        );
        return await response.text();
      },
      clear: () => {
        setBufferedContent("");
        setCurrentText("");
        setProcessCurrentLine(true);
        setCaretPosition(0);
        setBeforeCaretText("");
        setAfterCaretText("");
        return '';
      },
      mine_help: async () => {
        const response = await RconApi.runCommand("help");
        return response.data.message
      },
      m: async (expr) => {
        const response = await RconApi.runCommand(expr);
        return response.data.message
      },
    };
  
    const welcomeMessage = (
      <span>
        Type "help" for all available commands. <br />
      </span>
    );
  
  
    return (
      <div style={{ height: '70vh',width: '80vw'}}>
      <ReactTerminal
        prompt={prompt}
        theme={theme}
        showControlBar={controlBar}
        showControlButtons={controlButtons}
        welcomeMessage={welcomeMessage}
        commands={commands}
        defaultHandler={(command, commandArguments) => {
          return `${command} passed on to default handler with arguments ${commandArguments}`;
        }}
      />
      </div>
    )
  }

  return (
    <Box style={{ height: '100vh' }}>
      <Typography margin={3} variant="h2" gutterBottom>
        {t("commands.title")}
      </Typography>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <TerminalContextProvider>
          <Content />
        </TerminalContextProvider>
      </Box>
    </Box>
  );
}

export default Server;