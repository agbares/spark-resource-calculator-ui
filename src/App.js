
import {
  OutlinedInput,
  FormHelperText,
  FormControl,
  CssBaseline,
  Paper,
  Container,
  InputAdornment,
  Slider,
  Typography,
  Stack,
  Grid,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Component } from 'react';
import PercentIcon from '@mui/icons-material/Percent'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})


class App extends Component {
  constructor(props) {
    super(props)

    let usableMemory = (32 * 1024) - 300
    let memoryFraction = 0.5
    let storageFraction = 0.5
    let sparkMemory = this.getSparkMemory(usableMemory, memoryFraction)
    let storageMemory = this.getStorageMemory(storageFraction, sparkMemory)


    this.state = {
      usableMemory: usableMemory,
      sparkMemory: sparkMemory,
      userMemory: Math.trunc(this.getUserMemory(usableMemory, sparkMemory) * 100) / 100,
      executionMemory: Math.trunc(this.getExecutionMemory(storageMemory, sparkMemory) * 100) / 100,
      storageMemory: storageMemory,
      memoryFraction: 0.50,
      storageFraction: 0.50,
    }
    this.onExecutorMemoryChange = this.onExecutorMemoryChange.bind(this)
    this.onMemoryFractionChange = this.onMemoryFractionChange.bind(this)
    this.onStorageFractionChange = this.onStorageFractionChange.bind(this)
    this.updateMemories = this.updateMemories.bind(this)
  }

  getUsableMemory(executionMemory) {
    return (executionMemory * 1024) - 300
  }

  getSparkMemory(usableMemory, memoryFraction) {
    return memoryFraction * usableMemory
  }

  getUserMemory(usableMemory, sparkMemory) {
    return usableMemory - sparkMemory
  }

  getStorageMemory(storageFraction, sparkMemory) {
    return storageFraction * sparkMemory
  }

  getExecutionMemory(storageMemory, sparkMemory) {
    return sparkMemory - storageMemory
  }

  updateMemories(data = {
    usableMemory: undefined,
    memoryFraction: undefined,
    storageFraction: undefined,
  }) {
    let usableMemory = data.usableMemory || this.state.usableMemory
    let memoryFraction = data.memoryFraction || this.state.memoryFraction
    let storageFraction = data.storageFraction || this.state.storageFraction

    let sparkMemory = this.getSparkMemory(usableMemory, memoryFraction)
    let userMemory = this.getUserMemory(usableMemory, sparkMemory)
    let storageMemory = this.getStorageMemory(storageFraction, sparkMemory)
    let executionMemory = this.getExecutionMemory(storageMemory, sparkMemory)

    this.setState(() => ({
      usableMemory: usableMemory,
      sparkMemory: Math.trunc(sparkMemory * 100) / 100,
      userMemory: Math.trunc(userMemory * 100) / 100,
      storageMemory: Math.trunc(storageMemory * 100) / 100,
      executionMemory: Math.trunc(executionMemory * 100) / 100
    }))
  }

  onExecutorMemoryChange(event) {
    this.updateMemories({
      usableMemory: this.getUsableMemory(event.target.value)
    })
  }

  onMemoryFractionChange(event) {
    let memoryFraction = event.target.value / 100
    
    this.setState(
      () => ({memoryFraction: memoryFraction}),
      this.updateMemories({memoryFraction: memoryFraction})
    )
  }

  onStorageFractionChange(event) {
    let storageFraction = event.target.value / 100
    this.setState(
      () => ({storageFraction: storageFraction}),
      this.updateMemories({storageFraction: storageFraction})
    )
  }

  render() {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container
          maxWidth="md"
        >
          <Paper elevation={5} sx={{ m: 2 }} style={{ padding: 10}}>
            <Typography gutterBottom align="center" variant="h5" style={{marginTop: 10}}>Spark Resource Calculator</Typography>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Grid item xs={5}>
                <Grid
                  container
                  spacing={2}
                  direction="column"
                  justifyContent="space-between"
                  alignItems="stretch"
                >
                  <Grid item>
                    <FormControl fullWidth >
                      <OutlinedInput
                        defaultValue={16}
                        onChange={this.onExecutorMemoryChange}
                        id="outlined-adornment-weight"
                        endAdornment={<InputAdornment position="end">GB</InputAdornment>}
                        type="number"
                      />
                      <FormHelperText id="outlined-weight-helper-text">Executor Memory</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth >
                      <Typography align="center" gutterBottom>spark.memory.fraction</Typography>
                      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <PercentIcon />
                        <Slider
                          defaultValue={50}
                          min={0}
                          max={100}
                          valueLabelDisplay="auto"
                          onChange={this.onMemoryFractionChange}
                        />
                        <PercentIcon />
                      </Stack>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <Typography align="center" gutterBottom>spark.memory.storageFraction</Typography>
                      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <PercentIcon />
                        <Slider
                          defaultValue={50}
                          min={0}
                          max={100}
                          valueLabelDisplay="auto"
                          onChange={this.onStorageFractionChange}
                        />
                        <PercentIcon />
                      </Stack>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={5}>
                <Grid
                  container
                  spacing={2}
                  direction="column"
                  justifyContent="space-around"
                  alignItems="stretch"
                >
                  <Grid item>
                    <FormControl fullWidth>
                      <OutlinedInput
                        value={this.state.usableMemory}
                        disabled
                        id="outlined-adornment-weight"
                        endAdornment={<InputAdornment position="end">MB</InputAdornment>}
                        type="number"
                      />
                      <FormHelperText id="outlined-weight-helper-text">Usable Memory</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <Typography gutterBottom sx={{ 'paddingTop': 1}}>Spark/User Memory</Typography>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <OutlinedInput
                        value={this.state.sparkMemory}
                        disabled
                        id="outlined-adornment-weight"
                        endAdornment={<InputAdornment position="end">MB</InputAdornment>}
                        type="number"
                      />
                      <FormHelperText id="outlined-weight-helper-text">Spark Memory</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <OutlinedInput
                        value={this.state.userMemory}
                        disabled
                        id="outlined-adornment-weight"
                        endAdornment={<InputAdornment position="end">MB</InputAdornment>}
                        type="number"
                      />
                      <FormHelperText id="outlined-weight-helper-text">User Memory</FormHelperText>
                    </FormControl>

                  </Grid>
                  <Grid item>
                    <Typography gutterBottom sx={{ 'paddingTop': 1}}>Execution/Storage Memory</Typography>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <OutlinedInput
                        value={this.state.executionMemory}
                        disabled
                        id="outlined-adornment-weight"
                        endAdornment={<InputAdornment position="end">MB</InputAdornment>}
                        type="number"
                      />
                      <FormHelperText id="outlined-weight-helper-text">Execution Memory</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <OutlinedInput
                        value={this.state.storageMemory}
                        disabled
                        id="outlined-adornment-weight"
                        endAdornment={<InputAdornment position="end">MB</InputAdornment>}
                        type="number"
                      />
                      <FormHelperText id="outlined-weight-helper-text">Storage Memory</FormHelperText>
                    </FormControl>
                  </Grid>
                  
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </ThemeProvider>
    )
  }
}

export default App;
