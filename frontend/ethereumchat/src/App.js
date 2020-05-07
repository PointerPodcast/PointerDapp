import React from "react";
import { Route } from "react-router-dom";
import Home from "./Scene/Home/Home";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';


export default function App() {
    // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    // const theme = React.useMemo(
    //     () =>
    //         createMuiTheme({
    //             palette: {
    //                 type: prefersDarkMode ? 'dark' : 'light',
    //             },
    //         }),
    //     [prefersDarkMode],
    // );

    return (
        <SnackbarProvider preventDuplicate >
            <Route path="/" component={Home} />
        </SnackbarProvider>

    );
}
