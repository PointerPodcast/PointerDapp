import React, { useState, useEffect, useRef } from "react";
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    TIME_MACHINE_ABI,
    GROUPS_ABI
} from "../../Services/Ethereum/config";

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
    const classes = useStyles();
    const { height, width } = useWindowDimensions();
    const [open, setOpen] = React.useState(false);
    const [groupName, setGroupName] = useState('');
    const web3 = useRef();
    const accounts = useRef();
    const contratto = useRef();
    const [address, setAddress] = useState('');
    const [render, setRender] = React.useState(false);
    const [groupNames, setGroupNames] = useState([]);

    useEffect(() => {
        async function anyNameFunction() {
            console.log("refresh")
            web3.current = new Web3('HTTP://127.0.0.1:8545')
            accounts.current = await web3.current.eth.getAccounts()
            setAddress(accounts.current[0])
            contratto.current = new web3.current.eth.Contract(
                TIME_MACHINE_ABI,
                "0x8e02756305e1d9319EA7905822D26a7911505cf8"
            )

            contratto.current.methods
                .getGroups()
                .call({ from: address })
                .then((result) => {
                    Promise.all(
                        result.map(async (groupAddress) => {
                            const groupContract = new web3.current.eth.Contract(
                                GROUPS_ABI,
                                groupAddress
                            );
                            var name = await groupContract.methods
                                .getGroupName()
                                .call({ from: address })
                                .then((result) => {
                                    return web3.current.utils.toUtf8(result)
                                });
                            return name
                        })
                    ).then(function (results) {
                        setGroupNames(results);
                    });
                });
        }
        anyNameFunction();

    }, [render]);

    useEffect(() => {
        console.log(groupNames)
    }, [groupNames]);


    const createGroup = async () => {
        if (groupName == '') {
            alert("This field cannot be empty");
        }
        else {
            contratto.current.methods
                .createGroup(web3.current.utils.fromAscii(groupName))
                .send({
                    from: address,
                    gas: 1000000,
                    gasPrice: '1'
                })
                .on("confirmation", (confirmationNumber, receipt) => {
                    handleClose();
                })
                .on("error", (error) => {
                    console.log(error);
                });
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


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
                        <Button variant="contained" color="primary" onClick={handleClickOpen}>
                            Add Group
                        </Button>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Create a new Group</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Insert the group name:
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin=""
                                    id="name"
                                    label="Group Name"
                                    type="string"
                                    fullWidth
                                    onChange={e => setGroupName(e.target.value)}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={createGroup} color="primary">
                                    Create Group
                                 </Button>
                            </DialogActions>
                        </Dialog>
                        {groupNames.map((value, _) => {
                            return <div>{value}</div>
                        })}
                    </Container>

                </Grid>


                <Grid item xs={9} spacing={3} >
                    <Box >
                        <Box height={height - 156} style={{ overflow: 'auto' }}>
                            <Paper >
                                {elements.map((value, _) => {
                                    return <Message sender={address} body={value}></Message>
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
