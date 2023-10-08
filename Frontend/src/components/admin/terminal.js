import React, { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'; // Import Box component from Mui
import RconApi from '../../services/rcon';
import { useTranslation } from 'react-i18next';
import { TerminalContextProvider } from "react-terminal-es";
import { ReactTerminal, TerminalContext } from "react-terminal-es";
import SocketClient from '../../socketConnection'
import Swal from 'sweetalert2'

function Terminal() {
  const { t } = useTranslation();
  const maxLength = 50;

  const Content = () => {
    const {
      setBufferedContent,
    } = useContext(TerminalContext)
    const [theme, setTheme] = React.useState("matrix");
    const [controlBar, setControlBar] = React.useState(true);
    const [controlButtons, setControlButtons] = React.useState(true);
    const [prompt, setPrompt] = React.useState("(੭｡╹▿╹｡)੭>");
    const [socket, setSocket] = useState(null);

    const commands = {
      help: (
        <span>
          <strong>limpiar</strong> - {t("terminal.clearMessage")}<br />
          <strong>change_prompt &lt;{t("terminal.prompt")}&gt;</strong> - {t("terminal.promptMessage")}<br />
          <strong>change_theme &lt;{t("terminal.theme")}&gt;</strong> - {t("terminal.themeMessage")} - light, dark, material-light, material-dark,
          material-ocean, matrix and dracula. <br />
          <strong>toggle_control_bar</strong> - {t("terminal.toggleControlBarMessage")}<br />
          <strong>toggle_control_buttons</strong> - {t("terminal.buttonsControlBarMessage")}<br />
          <strong>evaluate_math_expression &lt;EXPR&gt;</strong> - {t("terminal.mathExpressionMessage")} (eg, <strong>4*4</strong>)
          <strong>mine_help</strong> - {t("terminal.minecraftHelpMessage")} <br />
          <strong>m &lt;PROMPT&gt;</strong> {t("terminal.runMinecraftCommandMessage")}<br />
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
      mine_help: async () => {
        const response = await RconApi.runCommand("help");
        return response.data.message
      },
      m: async (expr) => {
        const response = await RconApi.runCommand(expr);
        return response.data.message
      },
    };

    const initializeSocket = () => {
      const newSocket = SocketClient;
      setSocket(newSocket);
    };

    const welcomeMessage = (
      <span>
        {t("terminal.helpMessage")} <br />
      </span>
    );

    useEffect(() => {
      initializeSocket();

      return () => {
        if (socket) {
          socket.disconnect();
          setSocket(null);
        }
      };
    }, []);

    useEffect(() => {
      if (!socket) {
        return;
      }

      socket.on('authentication-error', () => {
        Swal.fire({
          icon: 'error',
          title: `${t("commons.errors.oops")}...`,
          text: t("commons.errors.authentication"),
        });
      });

      socket.on('docker-logs', (data) => {
        // Split the data by newline characters
        const lines = data.split('\n');

        // Map each line to a separate element
        const newContent = lines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ));

        setBufferedContent((prevContent) => {
          // Ensure that prevContent is initially an empty array
          if (!Array.isArray(prevContent)) {
            prevContent = [];
          }
          // Concatenate the new content with the previous content
          const updatedContent = [...prevContent, ...newContent];

          // If the updated content exceeds the maximum length, remove the oldest entries
          if (updatedContent.length > maxLength) {
            const start = updatedContent.length - maxLength;
            return updatedContent.slice(start);
          }

          return updatedContent;
        });
      });


      return () => {
        socket.off('authentication-error');
        socket.off('docker-logs');
        socket.off('disconnect');
      };
    }, [socket]);


    return (
      <div style={{ height: '70vh', width: '80vw' }}>
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

export default Terminal;