import React from "react";
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GroupList from './GroupList';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';


const GroupsBox = (props) => {
    return (
        <Container>
            <Grid container spacing={1}>
                <Grid item xs={12} spacing={3}>
                    <Button variant="contained" color="primary" endIcon={<AddIcon/>} onClick={props.handleClickOpen}>
                        <b>Create Pointer</b>
                    </Button>
                </Grid>
                <Grid item xs={12} spacing={3}>
                    <Button variant="contained" color="secondary" endIcon={<RemoveIcon/>} onClick={props.deleteGroup}>
                        <b>Delete Pointer</b>
                    </Button>
                </Grid>
            </Grid>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle style={{ backgroundColor: 'navy', color: 'white' }} fontWeight="fontWeightBold" id="form-dialog-title">Create a new Pointer</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Insert the pointer name:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        id="name"
                        label="Pointer Name"
                        type="string"
                        fullWidth
                        onChange={e => props.setGroupName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClickClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={props.createGroup} color="primary">
                        Create Pointer
                    </Button>
                </DialogActions>
            </Dialog>

            <GroupList groupNames={props.groupNames} changeGroup={props.changeSelectedGroup} ></GroupList>
        </Container>
    )
}

export default GroupsBox;



