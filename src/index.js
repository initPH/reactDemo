import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={()=> this.props.onClick(i)}/>
    )
  }
  render() {
    let lines = [[0,1,2],[3,4,5],[6,7,8]]
    return lines.map((item, index)=>{
      return <div className='board-row' key={index}>
        {item.map(i => this.renderSquare(i))}
      </div>
    })
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      isDesc: false,
      goHistory: []
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const goHistory = this.state.goHistory.slice(0, this.state.stepNumber)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    // 坐标
    let coordinate = i===0?[1,1]:[parseInt(i/3)+1, (i % 3)+1]
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      goHistory: goHistory.concat([coordinate])
    })
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
  orderChange() {
    this.setState({
      isDesc: !this.state.isDesc
    })
  }
  render() {
    const history = this.state.history.slice()
    const current = history[this.state.stepNumber]
    const [winner, steps] = calculateWinner(current.squares) ? calculateWinner(current.squares):[null,null]
    console.log(steps)
    const moves = history.map((move, step) => {
      const desc = step ? 'Go to move#' + step : 'Go to game start'
      const route = this.state.goHistory.slice(0, step)
      return (
        <li key={step}>
          <button className={step === this.state.stepNumber ? 'active': ''} onClick={() => this.jumpTo(step)}>{desc}</button>
          <span>
            {route.map((a,b) => {
              return  <span  key={b}><span className={(a[0]+a[1] in [1,2,3,4])? 'aaa':'bbb'}>({a[0]}, {a[1]})</span><span>{b<route.length-1?'=>':''}</span></span>
            })}
          </span>
        </li>
      )
    })
    if (this.state.isDesc) {
      moves.reverse()
    }
    let status
    if (history.length < 10) {
      if (winner) {
        status = 'Winner: ' + winner
      } else {
        status = 'Next player: ' + (this.state.xIsNext?'X':'O')
      }
    } else {
      status = 'A draw'
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares = {current.squares}
          onClick = {(i) => this.handleClick(i)}/>
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <button onClick={() => this.orderChange()}>{this.state.isDesc?'降序':'升序'}</button>
          <ol reversed={this.state.isDesc}>{moves}</ol>
        </div>
      </div>
    )
  }
}

function calculateWinner(squares) {
  const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
  for (let i = 0;i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a,b,c]]
    }
  }
  return null
}

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
)