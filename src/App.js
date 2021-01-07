import React from 'react';
import './styles.scss';
import alarmSound from './sound/alarm.mp3'

let timerSI;
let timerSIms;
let alarm = new Audio(alarmSound);
alarm.loop = true

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timer1: 25,
      timer2: 0,
      timer3: 0,
      session: 25,
      break: 5,
      times: 4,
      disabelMenu: false,
      disablePlay: false,
      disablePause: true,
      disableStop: true,
      timesFlag: true,
      sesBrkEnd: 'READY',
    }

    this.timesRef = React.createRef();
    this.timerRef = React.createRef();
    this.sesBrkRef = React.createRef();

  }

  componentDidMount() {
    this.sesBrkRef.current.setAttribute('class', 'bg-success text-white');
  }

  componentDidUpdate() {
    if (this.state.timer1 < 0 || this.state.timer2 < 0 || this.state.timer3 < 0) {
      this.stop();
    }
    switch (this.state.sesBrkEnd) {
      case 'READY':
        this.sesBrkRef.current.setAttribute('class', 'bg-success text-white');
        break;
      case 'SESSION':
        this.sesBrkRef.current.setAttribute('class', 'bg-warning text-dark');
        break;
      case 'BREAK':
        this.sesBrkRef.current.setAttribute('class', 'bg-info text-white');
        break;
      case 'END':
        this.sesBrkRef.current.setAttribute('class', 'bg-danger text-white');
        break;
      default:
        break;
    }
  }

  handleClickSBT(opt) {
    switch (opt) {
      case 'S-': if (this.state.session > 1) { this.setState({ timer1: this.state.timer1 - 1, session: this.state.session - 1 }) } break;
      case 'S+': if (this.state.session < 60) { this.setState({ timer1: this.state.timer1 + 1, session: this.state.session + 1 }) } break;
      case 'B-': if (this.state.break > 1) { this.setState({ break: this.state.break - 1 }) } break;
      case 'B+': if (this.state.break < 60) { this.setState({ break: this.state.break + 1 }) } break;
      case 'T-': if (this.state.times > 1) { this.setState({ times: this.state.times - 1 }) } break;
      case 'T+': this.setState({ times: this.state.times + 1, disablePlay: false }); break;
      default: break;
    }
  }

  handleClickMenu(opt) {
    switch (opt) {
      case 'PLAY':
        this.setState({
          disabelMenu: true,
          disablePlay: true,
          disablePause: false,
          disableStop: false,
          sesBrkEnd: (this.state.timesFlag) ? 'SESSION' : 'BREAK',
        });
        timerSI = setInterval(
          function (App) {
            if (App.state.timer2 - 1 === -1) {
              App.setState({
                timer1: App.state.timer1 - 1, timer2: 59,
              })
            } else {
              App.setState({
                timer2: App.state.timer2 - 1,
              });
            }
          }, 1000, this);
        timerSIms = setInterval(
          function (App) {
            if (App.state.timer3 - 1 === -1) {
              App.setState({
                timer3: 999
              })
            } else {
              App.setState({
                timer3: App.state.timer3 - 1,
              });
            }
          }, 10, this);
        break;
      case 'PAUSE':
        clearInterval(timerSI);
        clearInterval(timerSIms);
        this.setState({
          disabelMenu: true,
          disablePlay: false,
          disablePause: true,
          disableStop: false,
        });
        break;
      case 'STOP':
        clearInterval(timerSI);
        clearInterval(timerSIms);
        alarm.load();
        this.timerRef.current.setAttribute('style', 'animation-iteration-count: 0;');
        this.setState({
          timer1: 25,
          timer2: 0,
          timer3: 0,
          session: 25,
          break: 5,
          times: 4,
          disabelMenu: false,
          disablePlay: false,
          disablePause: true,
          disableStop: true,
          timesFlag: true,
          sesBrkEnd: 'READY'
        });
        if (this.state.times <= 0) {
          this.setState({
            times: 1,
          })
        }
        break;
      default:
        break;
    }
  }

  stop() {
    if (this.state.timesFlag) {
      this.setState({
        timer1: this.state.break,
        timer2: 0,
        timer3: 0,
        session: this.state.session,
        break: this.state.break,
        times: this.state.times,
        disabelMenu: true,
        disablePlay: true,
        disablePause: false,
        disableStop: false,
        timesFlag: !this.state.timesFlag,
        sesBrkEnd: 'BREAK'
      });
      alarm.play();
      setTimeout(function () { alarm.load() }, alarm.duration * 1000 * 1);
    } else {
      this.setState({
        timer1: this.state.session,
        timer2: 0,
        timer3: 0,
        session: this.state.session,
        break: this.state.break,
        times: this.state.times - 1,
        disabelMenu: true,
        disablePlay: true,
        disablePause: false,
        disableStop: false,
        timesFlag: !this.state.timesFlag,
        sesBrkEnd: 'SESSION',
      });
      if (this.state.times - 1 > 0) {
        alarm.play();
        setTimeout(function () { alarm.load() }, alarm.duration * 1000 * 3);
      } else {
        clearInterval(timerSI);
        clearInterval(timerSIms);
        alarm.play();
        this.setState({
          timer1: 0,
          timer2: 0,
          timer3: 0,
          disableStop: false,
          sesBrkEnd: 'END'
        });
        this.timerRef.current.setAttribute('style', 'animation-iteration-count: infinite;');
      }
    }
  }

  render() {
    return (
      <div id="app">
        <h1>Timer</h1>
        <main id="display">
          <div id="col-1">
            <div id="section">
              <h4>Session</h4>
              <div>
                <button disabled={this.state.disabelMenu} onClick={this.handleClickSBT.bind(this, 'S-')}>-</button>
                <p>{this.state.session}min</p>
                <button disabled={this.state.disabelMenu} onClick={this.handleClickSBT.bind(this, 'S+')}>+</button>
              </div>
            </div>
            <div id="break">
              <h4>Break</h4>
              <div>
                <button disabled={this.state.disabelMenu} onClick={this.handleClickSBT.bind(this, 'B-')}>-</button>
                <p>{this.state.break}min</p>
                <button disabled={this.state.disabelMenu} onClick={this.handleClickSBT.bind(this, 'B+')}>+</button>
              </div>
            </div>
            <div id="times">
              <h4>Repeat</h4>
              <div>
                <button disabled={this.state.disabelMenu} onClick={this.handleClickSBT.bind(this, 'T-')}>-</button>
                <p ref={this.timesRef}>{this.state.times}</p>
                <button disabled={this.state.disabelMenu} onClick={this.handleClickSBT.bind(this, 'T+')}>+</button>
              </div>
            </div>
          </div>
          <div id="col-2">
            <div id="timer" ref={this.timerRef}>
              <p>{String(this.state.timer1).padStart(2, '0')}:{String(this.state.timer2).padStart(2, '0')}</p>
              <p>{String(this.state.timer3).padStart(3, '0')}</p>
            </div>
            <h5 ref={this.sesBrkRef}>{this.state.sesBrkEnd}</h5>
            <div id="control">
              <button disabled={this.state.disablePlay} onClick={this.handleClickMenu.bind(this, 'PLAY')}><span class="mdi mdi-play"></span></button>
              <button disabled={this.state.disablePause} onClick={this.handleClickMenu.bind(this, 'PAUSE')}><span class="mdi mdi-pause"></span></button>
              <button disabled={this.state.disableStop} onClick={this.handleClickMenu.bind(this, 'STOP')}><span class="mdi mdi-stop"></span></button>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default App;
