import React, { useState, useEffect } from "react";
import { TextField, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Web3 from "web3";
import {
    TIME_MACHINE_ABI
} from "../../Services/Ethereum/config";

const Login = () => {
    const [username, setUsername] = useState('');
    const [account, setAccount] = useState('');
    var web3;


    async function fetchMyAccount() {
        web3 = new Web3(Web3.givenProvider)
        //web3 = new Web3('HTTP://127.0.0.1:8545') TODO: why?
        const accounts = await web3.eth.getAccounts()
        const network = await web3.eth.net.getNetworkType();
        setAccount(accounts[0])
    }

    useEffect(() => {
        fetchMyAccount()
    });



    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username == '') {
            alert('Field Required');
        }
        else {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts)
            const address = accounts[0];
            const contratto = new web3.eth.Contract(
                TIME_MACHINE_ABI,
                "0x8e02756305e1d9319EA7905822D26a7911505cf8"
            );
            contratto.methods
                .setUsername(web3.utils.fromAscii(username))
                .send({
                    from: address,
                })
                .on("confirmation", (confirmationNumber, receipt) => {
                    console.log("ok")
                })
                .on("error", (error) => {
                    console.log(error)
                });
        }
    }


    return (
        <div>
            <Grid container
                spacing={3}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: "100vh" }}
            >
                <Grid item xs={12} >
                    <TextField
                        id="outlined-basic"
                        label="Username"
                        variant="outlined"
                        onChange={e => setUsername(e.target.value)} />
                </Grid>
                <Grid item xs={12} >
                    <Button variant="contained" color="primary" onClick={handleSubmit} >
                        Login!
                        </Button>
                </Grid>

            </Grid>
            <Paper />

        </div >

    );
}

export default (Login);
