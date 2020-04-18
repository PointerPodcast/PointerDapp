import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';


export default function Message(props) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} style={{ padding: 20 }}>
                <Grid container spacing={2}>
                    <Grid item><Avatar>H</Avatar></Grid>
                    <Grid item>
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

        </Grid>
    );
}

