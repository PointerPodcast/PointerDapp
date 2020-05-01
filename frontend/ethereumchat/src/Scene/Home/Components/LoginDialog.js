import React from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const LoginDialog = (props) => {
    return (
        <div>
            <Dialog open={props.openLogin} aria-labelledby="form-dialog-title">
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
                        onChange={e => props.setLoginUsername(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>

                    <Button onClick={props.handleLoginClose} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default LoginDialog;
