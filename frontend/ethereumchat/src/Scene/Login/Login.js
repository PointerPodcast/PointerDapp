// import React from 'react';

// import Web3 from "web3";


// const useStyles = makeStyles((theme) => ({


//     title: {
//         flexGrow: 1,
//     },
//     container: {
//         paddingTop: theme.spacing(7),
//     }
// }));

// const elements = ['one', 'two', 'three', "hello world", 'one', 'two', 'one', 'two', 'three', "hello world", 'one', 'two', 'one', 'two', 'three', "hello world", 'one', 'two', 'one', 'two', 'three', "hello world", 'one', 'two', 'one', 'two', 'three', "hello world", 'one', 'two', 'one', 'two', 'three', "hello world", 'one', 'two', 'one', 'two', 'three', "hello world", 'one', 'two', 'three', "hello world", 'one', 'two', 'three', "hello world", 'one', 'two', 'three', "hello world", 'one', 'two', 'three', "hello world"];

// export default function ButtonAppBar() {
//     const classes = useStyles();
//     const { height, width } = useWindowDimensions();
//     return (
//         <div className={classes.root}>
//             <AppBar>
//                 <Toolbar variant="dense">
//                     <Typography variant="h6" color="inherit">
//                         EthereumChat
//                         </Typography>
//                 </Toolbar>
//             </AppBar>
//             <Grid container spacing={1} className={classes.container}>
//                 <Grid item xs={3}>
//                     <Container>
//                         <Button variant="contained" color="primary">
//                             Add Group
//                             </Button>

//                     </Container>
//                 </Grid>


//                 <Grid item xs={9} spacing={3} >
//                     <Box >
//                         <Box height={height - 156} style={{ overflow: 'auto' }}>
//                             <Paper >
//                                 {elements.map((value, _) => {
//                                     return <Message sender="Luca" body={value}></Message>
//                                 })}

//                             </Paper>
//                         </Box>
//                         <Box>
//                             <Grid item>
//                                 <TextField
//                                     id="multiline-static"
//                                     fullWidth
//                                     multiline
//                                     rows="2"
//                                     InputLabelProps={{
//                                         shrink: true
//                                     }}
//                                     placeholder="Start writing your message"
//                                     className={classes.textField}
//                                     margin="normal"
//                                 // style={{ position: 'absolute', }}
//                                 />
//                             </Grid>
//                         </Box>
//                     </Box>





//                 </Grid>
//             </Grid >



//         </div >
//     );
// }