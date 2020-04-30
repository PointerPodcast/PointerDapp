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
    GROUPS_ABI,
    TIME_MACHINE_ADDRESS
} from "../../Services/Ethereum/config";
import GroupList from '../Home/Components/GroupList';



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
    const [GroupAddresses, setGroupAddresses] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('')
    const [username, setUsername] = useState('')

    const [messages, setMessages] = useState([])
    const [openLogin, setOpenLogin] = React.useState(true);
    const [loginUsername, setLoginUsername] = useState('');


    useEffect(() => {
        async function anyNameFunction() {
            console.log("refresh")
            //web3.current = new Web3('HTTP://127.0.0.1:8545')
            web3.current = new Web3(Web3.givenProvider)
            accounts.current = await web3.current.eth.getAccounts()
            setAddress(accounts.current[0])
            contratto.current = new web3.current.eth.Contract(
                TIME_MACHINE_ABI,
                TIME_MACHINE_ADDRESS
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
                            setGroupAddresses([])
                            var name = await groupContract.methods
                                .getGroupName()
                                .call({ from: address })
                                .then((result) => {
                                    setGroupAddresses(GroupAddresses => GroupAddresses.concat(groupAddress));
                                    return web3.current.utils.toUtf8(result)
                                });

                            return { groupName: name, addressG: groupAddress }
                        })
                    ).then(function (results) {
                        console.log(results.length)
                        setGroupNames(results);
                    });
                });

            contratto.current.methods
                .getUsername()
                .call({ from: accounts.current[0] })
                .then((result) => {
                    try {
                        if (result == "0x0000000000000000000000000000000000000000000000000000000000000000")
                            setOpenLogin(true)
                        else {
                            console.log(result)
                            setUsername(web3.current.utils.toUtf8(result))
                            console.log(web3.current.utils.toUtf8(result))
                            setOpenLogin(false)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                });
        }
        anyNameFunction();

    }, [render]);


    useEffect(() => {
        setMessages([])
        console.log(groupNames)
        for (var i = 0; i < groupNames.length; i++) {
            const groupContract = new web3.current.eth.Contract(
                GROUPS_ABI,
                GroupAddresses[i]
            );

            groupContract.events.Message({
                fromBlock: 0
            }, function (error, event) {
                console.log(event)
                setMessages(messages => messages.concat({
                    name: web3.current.utils.toUtf8(event.returnValues.from),
                    message: web3.current.utils.toUtf8(event.returnValues.message),
                    groupName: event.address,
                    hash: event.transactionHash
                }));

            })

        }
    }, [groupNames]);



    const createGroup = async () => {
        if (groupName == '') {
            alert("This field cannot be empty");
        }
        else {
            contratto.current.methods
                .createGroup(web3.current.utils.fromAscii(groupName))
                .send({
                    from: address
                    //gas: 1000000,
                    //gasPrice: '1'
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
        render ? setRender(false) : setRender(true);
    };

    const sendMessage = () => {
        var message = document.getElementById('multiline-static').value
        if (selectedGroup == '') {
            alert("Seleziona un gruppo in cui inviare il messaggio")
        }
        else if (message != '') {
            const groupContract = new web3.current.eth.Contract(
                GROUPS_ABI,
                selectedGroup
            );
            groupContract.methods
                .sendEventMessage(web3.current.utils.fromAscii(message), false)
                .send({
                    from: address
                    //          gas: 1000000,
                    //         gasPrice: '1'
                })
                .on("confirmation", (confirmationNumber, receipt) => {
                    console.log("Inviato")
                })
                .on("error", (error) => {
                    console.log(error);
                });
        }
        document.getElementById('multiline-static').value = ""

    }


    const changeSelectedGroup = (address) => {
        setSelectedGroup(address);
        console.log(address)
    };


    const handleLoginClose = () => {
        if (loginUsername == '') {
            alert('Il campo username non può essere lasciato vuoto');
        }
        else {
            contratto.current.methods
                .setUsername(web3.current.utils.fromAscii(loginUsername))
                .send({
                    from: address,
                })
                .on("confirmation", (confirmationNumber, receipt) => {
                    setOpenLogin(false);
                })
                .on("error", (error) => {
                    if (error.message.includes('Address already registered')) {
                        setOpenLogin(false);
                    }
                });
        }
    };

    var list = []

    const generateMessages =
        messages.slice(0).reverse().map((value, _) => {
            console.log(value.hash)
            if (value.groupName == selectedGroup && list.indexOf(value.hash) === -1) {
                console.log(value)
                list.push(value.hash)
                return (<Message sender={value.name} body={value.message}></Message>)

            }
        })



    return (
        <div className={classes.root}>
            <AppBar>
                <Toolbar variant="dense">

                    <Typography variant="h6" color="inherit" className={classes.title}>
                        EthereumChat
                        </Typography>
                    <Button color="inherit">{username}</Button>
                </Toolbar>
            </AppBar>


            <Dialog open={openLogin} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Insert your username to use the chat!
          </DialogContentText>
                    <TextField
                        autoFocus
                        id="name"
                        label="Username"
                        type="string"
                        fullWidth
                        onChange={e => setLoginUsername(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleLoginClose} color="primary">
                        Login
          </Button>
                </DialogActions>
            </Dialog>



            <Grid container spacing={1} className={classes.container}>
                <Grid item xs={12} sm={5} md={3} xl={3}>
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

                        <GroupList groupNames={groupNames} changeGroup={changeSelectedGroup} ></GroupList>
                    </Container>

                </Grid>


                <Grid item xs={12} sm={7} md={9} xl={9} spacing={3} >
                    <Box >
                        <Box height={height - 156} style={{ overflow: 'auto' }}>
                            {generateMessages}

                        </Box>
                        <Box>
                            <Grid container >
                                <Grid item xs={10}>
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

                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button color="primary" onClick={sendMessage}>
                                        Send
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid >



        </div >
    );
}
export default Home;

