import React from "react";
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GroupList from './GroupList';


const GroupsBox = (props) => {
    return (
        <Container>
            <Button variant="contained" color="primary" onClick={props.handleClickOpen}>
                Add Group
                        </Button>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
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
                        onChange={e => props.setGroupName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                                </Button>
                    <Button onClick={props.createGroup} color="primary">
                        Create Group
                                 </Button>
                </DialogActions>
            </Dialog>

            <GroupList groupNames={props.groupNames} changeGroup={props.changeSelectedGroup} ></GroupList>
        </Container>
    )
}

export default GroupsBox;



