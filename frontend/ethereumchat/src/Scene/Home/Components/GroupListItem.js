import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';


const GroupListItem = (props) => {
    const address = props.address;

    return (
        <ListItem button onClick={() => props.changeGroup(address)} >
            <ListItemIcon>
                <Avatar src={props.avatar}/>
            </ListItemIcon>
            <ListItemText
                disableTypography
                primary={<Typography type="body2"><b>{props.name}</b></Typography>}
            />
        </ListItem>
    );
}

export default GroupListItem;
