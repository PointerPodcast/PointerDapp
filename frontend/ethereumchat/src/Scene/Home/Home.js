import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { AppBar, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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


const Home = () => {
    const classes = useStyles();

    const { height, width } = useWindowDimensions();
    const [open, setOpen] = React.useState(false);
    const [groupName, setGroupName] = useState('');
    const [render, setRender] = React.useState(false);
    const [groupNames, setGroupNames] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('')
    const [username, setUsername] = useState('')
    const [messages, setMessages] = useState([])
    const [lastGroupBlock, setLastGroupBlock] = useState({})
    const [openLogin, setOpenLogin] = React.useState(false);
    const [loginUsername, setLoginUsername] = useState('');
    const [isMetamaskInstalled, setMetamask] = useState(false);
    const [isSubscribedGroupMessages, setSubscribedGroupMessages] = useState({});

    var list = []
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(TIME_MACHINE_ABI, TIME_MACHINE_ADDRESS)

    /*
    window.addEventListener('load', () => {
    });
    */

    function getUsernameMethod() {
        web3.eth.getAccounts().then((accounts) =>
            contract.methods
                .getUsername()
                .call({ from: accounts[0] })
                .then((result) => {
                    var utf8Username = web3.utils.toUtf8(result)
                    if (utf8Username === '')
                        setOpenLogin(true)
                    else {
                        setUsername(web3.utils.toUtf8(result))
                        setOpenLogin(false)
                    }
                })
        );
    }

    function setUsernameMethod() {
        web3.eth.getAccounts().then((accounts) =>
            contract.methods
                .setUsername(web3.utils.fromAscii(loginUsername))
                .send({
                    from: accounts[0]
                })
                .on("confirmation", (confirmationNumber, receipt) => {
                    setOpenLogin(false);
                    setUsername(loginUsername);
                })
                .on("error", (error) => {
                    if (error.message.includes('Address already registered')) {
                        setOpenLogin(false);
                    }
                })
        )
    }

    function getGroupsMethod() {
        web3.eth.getAccounts().then((accounts) =>
            contract.methods
                .getGroups()
                .call({ from: accounts[0] })
                .then((result) => {
                    Promise.all(
                        result.map(async (groupAddress) => {
                            const groupContract = new web3.eth.Contract(
                                GROUPS_ABI,
                                groupAddress
                            );
                            var name = await groupContract.methods
                                .getGroupName()
                                .call({ from: accounts[0] })
                                .then((result) => {
                                    lastGroupBlock[groupAddress] = 0;
                                    setLastGroupBlock(lastGroupBlock);
                                    subscribeToGroupEvent(groupAddress);
                                    return web3.utils.toUtf8(result);
                                });
                            return { groupName: name, addressG: groupAddress }
                        })
                    ).then(function (results) {
                        setGroupNames(results);
                    });
                })
        );
    }

    const createGroup = async () => {
        if (groupName === '') {
            alert("This field cannot be empty");
            return;
        }
        web3.eth.getAccounts().then((accounts) =>
            contract.methods
                .createGroup(web3.utils.fromAscii(groupName))
                .send({
                    from: accounts[0],
                })
                .on("confirmation", (confirmationNumber, receipt) => {
                    handleClose();
                    getGroupsMethod();
                })
                .on("error", (error) => {
                    console.log(error);
                })
        );
    }

    function subscribeToGroupEvent(groupAddress){
        if(!isSubscribedGroupMessages[groupAddress]){
            console.log(groupAddress)
            const groupContract = new web3.eth.Contract(
                GROUPS_ABI,
                groupAddress
            );
            const lastSynchedBlock = lastGroupBlock[groupAddress];
            groupContract.events.Message({
                fromBlock: lastSynchedBlock,
            }, function (error, event) {
                web3.eth.getBlockNumber().then((lastblock) => lastGroupBlock[groupAddress] = lastblock+1); //sync according to latest block read
                setMessages(messages => messages.concat({
                    name: web3.utils.toUtf8(event.returnValues.from),
                    message: web3.utils.toUtf8(event.returnValues.message),
                    groupName: event.address,
                    hash: event.transactionHash //QUESTO CI STA CHE POSSA ESSERE TOLTO
                }));

            })
            isSubscribedGroupMessages[groupAddress] = true;
            setSubscribedGroupMessages(isSubscribedGroupMessages);
        }
    }


    function sendMessageMethod(message) {
        const groupContract = new web3.eth.Contract(
            GROUPS_ABI,
            selectedGroup
        );
        web3.eth.getAccounts().then((accounts) =>
            groupContract.methods
                .sendEventMessage(web3.utils.fromAscii(message), false)
                .send({
                    from: accounts[0]
                    //          gas: 1000000,
                    //          gasPrice: '1'
                })
                .on("confirmation", (confirmationNumber, receipt) => {
                    var boxDiv = document.getElementById("scrollBox");
                    boxDiv.scrollTop = boxDiv.scrollHeight;
                })
                .on("error", (error) => {
                    console.log(error);
                })
        );
    }


    useEffect(() => {
        async function setup() {

            getUsernameMethod()
            getGroupsMethod()
            setMetamask(true);
        }

        web3.eth.net.isListening().then((s) => {
<<<<<<< HEAD
            Web3.givenProvider.enable().then((res) => setup())
=======
            web3.eth.getAccounts(function (err, accounts) {
                if (err == null && accounts.length != 0)
                    setup()
            });


>>>>>>> e837056bd0486e95806a0ffff4bbc0c5b2401deb
        }).catch((e) => {

        })

    }, [ render]);


    const sendMessage = () => {
        var message = document.getElementById('multiline-static').value
        if (message === '')
            return
        if (selectedGroup === '') {
            alert("Please, select a group.")
            return
        }
        sendMessageMethod(message)
        document.getElementById('multiline-static').value = ""
    }


    const handleLoginClose = () => {
        if (loginUsername === '') {
            alert('Field Required');
            return
        }
        setUsernameMethod()
    };



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        render ? setRender(false) : setRender(true);
    };

    const changeSelectedGroup = (groupAddress) => {
        setSelectedGroup(groupAddress);
        var boxDiv = document.getElementById("scrollBox");
        boxDiv.scrollTop = boxDiv.scrollHeight;
    };


    const generateMessages =
        messages.slice(0).map((value, _) => {
            if (value.groupName === selectedGroup && list.indexOf(value.hash) === -1) {
                list.push(value.hash)
                var boxDiv = document.getElementById("scrollBox");
                boxDiv.scrollTop = boxDiv.scrollHeight;
                return (<Message sender={value.name} body={value.message}></Message>)
            }
        })



    return (
        <div className={classes.root}>
            <AppBar>
                <Toolbar variant="dense">

                    <Typography variant="h6" color="inherit" className={classes.title}>
                        <b>PointerDapp</b>
                    </Typography>
                    <Button color="inherit">{username}</Button>
                </Toolbar>
            </AppBar>
            {isMetamaskInstalled ? (
                <div>
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
                                <Box id="scrollBox" height={height - 156} style={{ overflow: 'auto' }}>
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
                </div>
            ) : (
                    <div>
                        <Dialog open={true} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Login</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Install Metamask to use PointerDapp
                            </DialogContentText>

                            </DialogContent>

                        </Dialog>
                    </div>
                )}





        </div >
    );
}
export default Home;

