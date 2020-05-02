import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box";
import useWindowDimensions from '../../../Hooks/useWindowDimension';


const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
    container: {
        paddingTop: theme.spacing(7),
    },


}));


const MessageBox = (props) => {
    const classes = useStyles();
    const { height, width } = useWindowDimensions();

    return (
        <Box className={classes.root} >
            <Box id="scrollBox" height={height - 156} style={{ overflow: 'auto' }}>
                {props.generateMessages}
            </Box>
            <Box>
                <Grid container >
                    <Grid item xs={10}>
                        <TextField
                            id="multiline-static"
                            fullWidth
                            multiline
                            rows="2"
                            inputProps={{
                                maxLength: 32
                            }} 
                            InputLabelProps={{
                                shrink: true
                            }}
                            placeholder="Start writing your message"
                            className={classes.textField}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button color="primary" onClick={props.sendMessage}>
                            Send
                                    </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default MessageBox;
