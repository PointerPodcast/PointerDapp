import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { AppBar, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
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
import LinearProgress from '@material-ui/core/LinearProgress';

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
    const [render, setRender] = React.useState(false);
    const [groupNames, setGroupNames] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('')
    const [username, setUsername] = useState('')
    const [messages, setMessages] = useState([])
    const [lastGroupBlock, setLastGroupBlock] = useState({})
    const [openLogin, setOpenLogin] = useState(false);
    const [loginUsername, setLoginUsername] = useState('');
    const [avatarLink, setAvatarLink] = useState('');
    const [isMetamaskInstalled, setMetamask] = useState(true);
    const [isSubscribedGroupMessages, setSubscribedGroupMessages] = useState({});

    var list = []
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(TIME_MACHINE_ABI, TIME_MACHINE_ADDRESS)
    
    /*
    window.addEventListener('load', () => {
    });
    */

    function subscribeToNewGroup(){
        const lastSynchedBlock = lastGroupBlock[TIME_MACHINE_ADDRESS];
        contract.events.NewGroup({
            fromBlock: lastSynchedBlock,
        }, function (error, event) {
            web3.eth.getBlockNumber().then((lastblock) => lastGroupBlock[TIME_MACHINE_ADDRESS] = lastblock+1); //sync according to latest block read
            getGroupsMethod()
        })
    }

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
						var link = 'https://avatars.dicebear.com/v2/identicon/:'+utf8Name+'.svg'
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
                                    lastGroupBlock[groupAddress] = 0;
                                    setLastGroupBlock(lastGroupBlock);
                                    subscribeToGroupEvent(groupAddress);
                                    return web3.utils.toUtf8(result);
                                });
                            var gAvatar = "https://avatars.dicebear.com/v2/bottts/"+name+".svg"
                            return { groupName: name, addressG: groupAddress, avatar: gAvatar}
                        })
                    ).then(function (results) {
                        setGroupNames(results);
                    });
                })
        );
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
                    alert(groupName + "deleted!");
                    getGroupsMethod();
                })
                .on("error", (error) => {
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

    function subscribeToGroupEvent(groupAddress) {
        if (!isSubscribedGroupMessages[groupAddress]) {
            const groupContract = new web3.eth.Contract(
                GROUPS_ABI,
                groupAddress
            );
            const lastSynchedBlock = lastGroupBlock[groupAddress];
            groupContract.events.Message({
                fromBlock: lastSynchedBlock,
            }, function (error, event) {
                web3.eth.getBlockNumber().then((lastblock) => lastGroupBlock[groupAddress] = lastblock + 1); //sync according to latest block read
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
            await getUsernameMethod();
            getGroupsMethod();
            subscribeToNewGroup();
        }

        web3.eth.net.isListening().then((s) => {
            Web3.givenProvider.enable().then((res) => setup())
        }).catch((e) => {
            setMetamask(false);
        })

    }, [render]);


    const sendMessage = () => {
        var message = document.getElementById('multiline-static').value
        if (message === '')
            return
        if (selectedGroup === '') {
            alert("Please, Select a group.")
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
    };

    const changeSelectedGroup = (groupAddress) => {
        setSelectedGroup(groupAddress);
        var boxDiv = document.getElementById("scrollBox");
        boxDiv.scrollTop = boxDiv.scrollHeight;
    };


    const generateMessages =
        messages.slice(0).reverse().map((value, _) => {
            if (value.groupName === selectedGroup && list.indexOf(value.hash) === -1) {
                list.push(value.hash)
                var boxDiv = document.getElementById("scrollBox");
                boxDiv.scrollTop = boxDiv.scrollHeight;
				var userLinkAvatar = 'https://avatars.dicebear.com/v2/identicon/:'+value.name+'.svg'
                return (<Message sender={value.name} body={value.message} avatar={userLinkAvatar}></Message>)
            }
        })


    return (
        <div className={classes.root}>
            <AppBar>
				<Toolbar variant="dense"  style={{ backgroundColor: 'teal', color: 'white' }} >
					<RecordVoiceOverIcon/>
					<Typography variant="h6" color="inherit" className={classes.title}>
						<Link href="https://pointerpodcast.it" color="inherit" className={classes.title}>
							<b>PointerDapp</b>
						</Link>
					</Typography>
					<Avatar  src={avatarLink}> | </Avatar>
					<Typography variant="h6" color="inherit" className={classes.title}>
						<b>{username}</b>
					</Typography>
                </Toolbar>
                <LinearProgress  color="secondary" />
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

            <LinearProgress  color="primary" />
        </div >
    );
}
export default Home;

