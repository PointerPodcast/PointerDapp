import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import GroupListItem from './GroupListItem';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

const GroupList = (props) => {
    const classes = useStyles();

    return (
        <List component="nav" className={classes.root} aria-label="contacts">
            {props.groupNames.map((value, index) => {
                return <GroupListItem name={value.groupName} changeGroup={props.changeGroup} address={value.addressG}></GroupListItem>
            })}
        </List>
    );
}

export default GroupList;
