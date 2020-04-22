import React, { useState } from "react";
import { TextField, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


const Login = () => {
    const [username, setUsername] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();
        if (username == '') {
            alert('Il campo username non può essere lasciato vuoto');
        }
        else {
            alert('It works!');
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