import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';


export default function Message(props) {
    return (
        <Grid item xs={12} sm container >
            <Grid item xs={1} container direction="column" style={{ paddingTop: 20, paddingLeft: 20 }}>
                <Avatar>H</Avatar>
            </Grid>


            <Grid item xs={9} container direction="column" style={{ padding: 20 }}>
                <Grid item xs>
                    <Typography component="div">
                        <Box fontWeight="fontWeightMedium" fontSize={16}>
                            {props.sender}
                        </Box>
                        <Box fontWeight="fontWeightRegular" fontSize={12}>
                            {props.body}
                        </Box>
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}

