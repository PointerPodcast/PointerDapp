import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { AppBar, Typography, List } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

    title: {
        flexGrow: 1,
    },
}));

export default function ButtonAppBar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">
                        EthereumChat
                        </Typography>
                </Toolbar>
            </AppBar>
            <div style={{ marginTop: '80px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <Container>
                            <Button variant="contained" color="primary">
                                Add Group
                            </Button>

                        </Container>
                    </Grid>


                    <Grid item xs={9}>


                        <Grid xs={3}>
                            <TextField
                                id="multiline-static"
                                // label="New Message"
                                fullWidth
                                multiline
                                rows="3"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                placeholder="Start writing your message"
                                className={classes.textField}
                                margin="normal"
                                style={{ position: 'absolute', }}
                            />
                        </Grid>


                    </Grid>
                </Grid>
            </div >


        </div >
    );
}