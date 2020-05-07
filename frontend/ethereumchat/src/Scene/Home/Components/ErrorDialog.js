import React from "react";
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';


const ErrorDialog = () => {
    return (
        <div>
            <Dialog open={true} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" style={{ backgroundColor: 'teal', color: 'white' }} >
                    <Link href="https://metamask.io/" color="inherit" >
                        <Grid container spacing={1}>
                            <Grid item> 
                                <Typography variant="h6" color="inherit" fontWeight="fontWeightBold">
                                    Metamask
                                </Typography>
                            </Grid>
                            <Grid item >
                                <Avatar src="https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-png-transparent.png" > </Avatar>
                            </Grid>
                        </Grid>
                    </Link>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Install Metamask to use PointerDapp
                            </DialogContentText>

                </DialogContent>

            </Dialog>
        </div>
    )
}

export default ErrorDialog;
