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
    const [groupsBytes32, setGroups] = useState([]);
    const [contratto, setContratto] = useState('');
    var web3;
    var address;
    var groupNamesTMP = [];
    const [groupNames, setGroupNames] = useState([]);

    // async function fetchMyAccount() {
    //     web3 = new Web3('HTTP://127.0.0.1:8545')
    //     var accounts = await web3.eth.getAccounts()
    //     address = accounts[0]
    // }

    // function fetchGroups() {
    //     const contratto = new web3.eth.Contract(
    //         TIME_MACHINE_ABI,
    //         "0x8e02756305e1d9319EA7905822D26a7911505cf8"
    //     )
    //     contratto.methods
    //         .getGroups()
    //         .call({ from: address })
    //         .then((result) => {
    //             result.map((groupAddress) => {
    //                 console.log(groupAddress)
    //                 retrieveGroupsName(groupAddress)
    //             })
    //         });
    // }

    // function retrieveGroupsName(groupAddress) {
    //     const groupContract = new web3.eth.Contract(
    //         GROUPS_ABI,
    //         groupAddress
    //     );
    //     groupContract.methods
    //         .getGroupName()
    //         .call({ from: address })
    //         .then((result) => {
    //             console.log(result)
    //             groupNames.push(result)
    //         });

    // }

    useEffect(() => {
        // Create an scoped async function in the hook
        async function anyNameFunction() {
            web3 = new Web3('HTTP://127.0.0.1:8545')
            var accounts = await web3.eth.getAccounts()
            address = accounts[0]
            const contratto = new web3.eth.Contract(
                TIME_MACHINE_ABI,
                "0x8e02756305e1d9319EA7905822D26a7911505cf8"
            )
            contratto.methods
                .getGroups()
                .call({ from: address })
                .then((result) => {
                    result.map((groupAddress) => {
                        const groupContract = new web3.eth.Contract(
                            GROUPS_ABI,
                            groupAddress
                        );
                        groupContract.methods
                            .getGroupName()
                            .call({ from: address })
                            .then((result) => {
                                setGroupNames(groupNames => groupNames.concat(web3.utils.toUtf8(result)));
                            });
                    })
                });
        }
        anyNameFunction();

    }, []);

    useEffect(() => {
        console.log(groupNames);
    }, [groupNames]);


    // useEffect(() => {
    //     fetchMyAccount()
    //     fetchGroups()
    //     console.log(groupNames)
    // });


    const createGroup = async () => {
        if (groupName == '') {
            alert("This field cannot be empty");
        }
        else {
            const accounts = await web3.eth.getAccounts();
            const address = accounts[0];

            const contratto = new web3.eth.Contract(
                TIME_MACHINE_ABI,
                "0x8e02756305e1d9319EA7905822D26a7911505cf8"
            )
            contratto.methods
                .createGroup(web3.utils.fromAscii(groupName))
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
