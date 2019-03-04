import React from 'react'
import ReactDOM from 'react-dom'
import './index.styl'

class Main extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}
/// Create the basic sidebar html, then we'll add the style css
// The sidebar where you take all your actions
class Sidebar extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="sidebar">
                <div className="selected-asset">ETH - BAT</div>
                <div>
                    <p>You own</p>
                    ETH: 10
                    BAT: 200
                </div>
                <div>
                    <button>Deposit</button>
                    <button>Withdraw</button>
                </div>
                <div>
                    <button>Buy</button>
                    <button>Sell</button>
                    <select>
                        <option value="market-order">Market Order</option>
                        <option value="limit-order">Limit Order</option>
                    </select>
                    <div>
                        <input ref="limit-order-amount" type="number" placeholder="amount"/>
                    </div>
                </div>
            </div>
        )
    }
}

// The main section to see live trades taking place
class Trades extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}

// Past historical trades
class History extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}

ReactDOM.render(<Main />, document.querySelector('#root'))
