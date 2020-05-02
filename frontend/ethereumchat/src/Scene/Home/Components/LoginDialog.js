import React from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';


const LoginDialog = (props) => {
    return (
        <div>
            <Dialog open={props.openLogin} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" style={{ backgroundColor: 'black', color: 'white' }} fontWeight="fontWeightBold">Join PointerDapp!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant="h6" color="inherit" fontWeight="fontWeightBold">
                            Insert your username to use the chat!
                        </Typography>
                        <Link href="https://faucet.rinkeby.io/" color="inherit" >
                            <Typography variant="h9" color="secondary" fontWeight="fontWeightBold">
                                Don't you have enough gas? <u>Faucet!</u>

                            </Typography>
                        </Link>
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
                    <Button onClick={props.handleLoginClose} color="secondary"  endIcon={<FavoriteIcon/>} >
                        SignUp
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default LoginDialog;
