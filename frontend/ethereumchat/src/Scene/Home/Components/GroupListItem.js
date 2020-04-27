import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';


const GroupListItem = (props) => {
    const address = props.address;

    return (
        <ListItem button onClick={() => props.changeGroup(address)} >
            <ListItemIcon>
                <Avatar>{props.name[0]}</Avatar>
            </ListItemIcon>
            <ListItemText primary={props.name} />
        </ListItem>
    );
}

export default GroupListItem;
