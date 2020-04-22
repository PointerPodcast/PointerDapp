import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { AppBar, Typography, List } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from "@material-ui/core/Box";
import Message from "./Components/Message"
import useWindowDimensions from '../../Hooks/useWindowDimension';
import Web3 from "web3";


const useStyles = makeStyles((theme) => ({


    title: {
        flexGrow: 1,
    },
    container: {
        paddingTop: theme.spacing(7),
    }
}));
const elements = ['one', 'two', 'three', "hello world", 'one', 'two', 'one', 'two', 'three', "hello world", 'one', 'two', 'one', 'two', 'three', "hello world", 'one', 'two', 'one', 'two', 'three', "hello world", 'one', 'two', 'one', 'two', 'three', "hello world", 'one', 'two', 'one', 'two', 'three', "hello world", 'one', 'two', 'one', 'two', 'three', "hello world", 'one', 'two', 'three', "hello world", 'one', 'two', 'three', "hello world", 'one', 'two', 'three', "hello world", 'one', 'two', 'three', "hello world"];

const Home = () => {
    const [account, setAccount] = useState('');

    async function fetchMyAccount() {
        const web3 = new Web3('HTTP://127.0.0.1:8545')
        const accounts = await web3.eth.getAccounts()
        const network = await web3.eth.net.getNetworkType();
        console.log(network)
        console.log(accounts)
        setAccount(accounts[0])
    }

    useEffect(() => {
        fetchMyAccount()
    });

    const classes = useStyles();
    const { height, width } = useWindowDimensions();
    return (
        <div className={classes.root}>
            <AppBar>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">
                        EthereumChat
                        </Typography>
                </Toolbar>
            </AppBar>
            <Grid container spacing={1} className={classes.container}>
                <Grid item xs={3}>
                    <Container>
                        <Button variant="contained" color="primary">
                            Add Group
                            </Button>

                    </Container>
                </Grid>


                <Grid item xs={9} spacing={3} >
                    <Box >
                        <Box height={height - 156} style={{ overflow: 'auto' }}>
                            <Paper >
                                {elements.map((value, _) => {
                                    return <Message sender={account} body={value}></Message>
                                })}

                            </Paper>
                        </Box>
                        <Box>
                            <Grid item>
                                <TextField
                                    id="multiline-static"
                                    fullWidth
                                    multiline
                                    rows="2"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    placeholder="Start writing your message"
                                    className={classes.textField}
                                    margin="normal"
                                // style={{ position: 'absolute', }}
                                />
                            </Grid>
                        </Box>
                    </Box>





                </Grid>
            </Grid >



        </div >
    );
}
export default Home;
