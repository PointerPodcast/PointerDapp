import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { AppBar, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Message from "./Components/Message"
import useWindowDimensions from '../../Hooks/useWindowDimension';
import Web3 from "web3";
import {
    TIME_MACHINE_ABI,
    GROUPS_ABI,
    TIME_MACHINE_ADDRESS
} from "../../Services/Ethereum/config";
import ErrorDialog from '../Home/Components/ErrorDialog';
import LoginDialog from '../Home/Components/LoginDialog';
import MessageBox from '../Home/Components/MessageBox';
import GroupsBox from '../Home/Components/GroupsBox';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import Link from '@material-ui/core/Link';
import { useSnackbar } from 'notistack';

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
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupNames, setGroupNames] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('')
    const [username, setUsername] = useState('')
    const [messages, setMessages] = useState([])
    const [openLogin, setOpenLogin] = useState(false);
    const [loginUsername, setLoginUsername] = useState('');
    const [avatarLink, setAvatarLink] = useState('');
    const [isMetamaskInstalled, setMetamask] = useState(true);
    const [isSubscribedGroupMessages, setSubscribedGroupMessages] = useState({});
    const [lastSyncBlock, setLastSyncBlock] = useState({});

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(TIME_MACHINE_ABI, TIME_MACHINE_ADDRESS);
    var list = []

    
    window.addEventListener('load', ()=> {
        web3.eth.net.isListening().then((listen) => {
            if(listen)
                Web3.givenProvider.enable().then((enabled) => {
                    if(enabled){
                        getUsernameMethod();
                        subscribeToNewGroup();
                        subscribeToGroupDeleted();
                        getGroupsMethod();
                    } })
        }).catch((e) => {
            setMetamask(false);
        })
    });



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
                        var utf8Name = web3.utils.toUtf8(result)
                        var link = 'https://avatars.dicebear.com/v2/identicon/:' + utf8Name + '.svg'
                        setAvatarLink(link)
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
                                    subscribeToGroupEvent(groupAddress);
                                    return web3.utils.toUtf8(result);
                                });
                            var gAvatar = "https://avatars.dicebear.com/v2/bottts/" + name + ".svg"
                            return { groupName: name, addressG: groupAddress, avatar: gAvatar }
                        })
                    ).then(function (results) {
                        setGroupNames(results);
                    });
                })
        );
    }

    function subscribeToNewGroup() {
        contract.events.NewGroup({
            fromBlock: 0,
        })
        .on('data', function (event) {
            getGroupsMethod()
        })
        .on('error', console.error)
    }

    function subscribeToGroupDeleted(){
        contract.events.GroupDeleted({
            fromBlock: 0,
        })
        .on('data', function (event) {
            getGroupsMethod();
        })
        .on('error', console.error)
    }


    function showNotification(message) {
        enqueueSnackbar(message, {
            variant: 'info'
        });
    };

    function subscribeToGroupEvent(groupAddress) {
        if (!isSubscribedGroupMessages[groupAddress]) {
            const groupContract = new web3.eth.Contract(
                GROUPS_ABI,
                groupAddress
            );
            groupContract.events.Message({
                fromBlock: 0,
            })
            .on('data', function (event) {
                var message = web3.utils.toUtf8(event.returnValues.message)
                var name = web3.utils.toUtf8(event.returnValues.from)
                var groupName = web3.utils.toUtf8(event.returnValues.groupName)
                setMessages(messages => messages.concat({
                    name: name,
                    message: message,
                    groupName: event.address,
                    hash: event.transactionHash 
                }));
                web3.eth.getBlockNumber().then((lastblock) => {
                    if (event.blockNumber === lastblock) {
                        showNotification(groupName+ "* |" + name + ": " + message);
                    }

                });
            })
            .on('error', console.error)
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

    const sendMessage = () => {
        var message = document.getElementById('multiline-static').value
        if (message === '') {
            alert("Please, write something.")
            return
        }
        if (selectedGroup === '') {
            alert("Please, Select a group.")
            return
        }
        sendMessageMethod(message)
        document.getElementById('multiline-static').value = ""
    }



    const deleteGroup = async () => {
        if (selectedGroup === '') {
            alert("Select a Group");
            return;
        }
        const groupContract = new web3.eth.Contract(
            GROUPS_ABI,
            selectedGroup 
        );
        web3.eth.getAccounts().then((accounts) =>
            groupContract.methods
                .closeGroup()
                .send({
                    from: accounts[0],
                })
                .on("confirmation", (confirmationNumber, receipt) => {
                    getGroupsMethod();
                })
                .on("error", (error) => {
                    alert("You are not the admin of this Pointer!");
                    console.log(error);
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
    };

    const changeSelectedGroup = (groupAddress) => {
        setSelectedGroup(groupAddress);
        var boxDiv = document.getElementById("scrollBox");
        boxDiv.scrollTop = boxDiv.scrollHeight;
    };


    const generateMessages =
        messages.slice(0).map((value, _) => {
            if (value.groupName === selectedGroup && list.indexOf(value.hash) === -1){ 
                list.push(value.hash)
                var boxDiv = document.getElementById("scrollBox");
                boxDiv.scrollTop = boxDiv.scrollHeight;
                var userLinkAvatar = 'https://avatars.dicebear.com/v2/identicon/:' + value.name + '.svg'
                return (<Message sender={value.name} body={value.message} avatar={userLinkAvatar}></Message>)
            }
        })


    return (
        <div className={classes.root}>
            <AppBar>
                <Toolbar variant="dense" style={{ backgroundColor: 'black', color: 'white' }} >
                    <RecordVoiceOverIcon />
                    <Typography variant="h6" color="inherit" className={classes.title}>
                        <Link href="https://pointerpodcast.it" color="inherit" className={classes.title}>
                            <b>PointerDapp</b>
                        </Link>
                    </Typography>
                    <Avatar src={avatarLink} > </Avatar>

                    <Typography color="inherit" style={{ paddingLeft: '0.5em' }}>
                        <b>{username}</b>
                    </Typography>
                </Toolbar>
            </AppBar>
            {isMetamaskInstalled ? (
                <div>

                    <LoginDialog openLogin={openLogin} handleLoginClose={handleLoginClose} setLoginUsername={setLoginUsername}></LoginDialog>
                    <Grid container spacing={1} className={classes.container}>
                        <Grid item xs={12} sm={5} md={3} xl={3}>
                            <GroupsBox
                                setGroupName={setGroupName}
                                open={open}
                                handleClickOpen={handleClickOpen}
                                handleClickClose={handleClose}
                                createGroup={createGroup}
                                deleteGroup={deleteGroup}
                                groupNames={groupNames}
                                changeSelectedGroup={changeSelectedGroup}
                            >
                            </GroupsBox>
                        </Grid>

                        <Grid item xs={12} sm={7} md={9} xl={9} spacing={3} >
                            <MessageBox
                                sendMessage={sendMessage}
                                generateMessages={generateMessages}
                            >

                            </MessageBox>
                        </Grid>
                    </Grid >
                </div>
            ) : (
                    ErrorDialog()
                )}
        </div >

    );
}
export default Home;

