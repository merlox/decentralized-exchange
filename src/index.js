import React from 'react'
import ReactDOM from 'react-dom'
import './index.styl'

class Main extends React.Component {
    constructor() {
        super()

        this.state = {
            trades: [{
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 123,
                type: 'buy',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 120, // You want to buy 120 firstSymbol
                price: 200 // When buying, you get 1 firstSymbol for selling 200 secondSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 80, // You want to buy 80 secondSymbol
                price: 305 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }],
            history: [{
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2,
                price: 20
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }, {
                id: 927,
                type: 'sell',
                firstSymbol: 'ETH',
                secondSymbol: 'BAT',
                quantity: 2, // You want to buy 80 secondSymbol
                price: 10 // When selling, you get 305 secondSymbol for selling 1 firstSymbol
            }]
        }
    }

    render() {
        return (
            <div className="main-container">
                <Sidebar />
                <Trades
                    trades={this.state.trades}
                />
                <History
                    history={this.state.history}
                />
            </div>
        )
    }
}

/// Create the basic sidebar html, then we'll add the style css
// The sidebar where you take all your actions
class Sidebar extends React.Component {
    constructor() {
        super()
        this.state = {
            showLimitOrderInput: false
        }
    }

    render() {
        return (
            <div className="sidebar">
                <div className="selected-assets-title">Selected assets:</div>
                <div className="selected-asset-one">ETH</div>
                <div className="selected-asset-two">BAT</div>
                <div className="your-portfolio">Your portfolio:</div>
                <div className="grid-center">ETH:</div><div className="grid-center">10</div>
                <div className="grid-center">BAT:</div><div className="grid-center">200</div>
                <div className="money-management">Money management:</div>
                <button className="button-outline">Deposit</button>
                <button className="button-outline">Withdraw</button>
                <div className="actions">Actions:</div>
                <button>Buy</button>
                <button className="sell">Sell</button>
                <select defaultValue="market-order" onChange={selected => {
                    if(selected.target.value == 'limit-order') this.setState({showLimitOrderInput: true})
                    else this.setState({showLimitOrderInput: false})
                }}>
                    <option value="market-order">Market Order</option>
                    <option value="limit-order">Limit Order</option>
                </select>
                <input ref="limit-order-amount" className={this.state.showLimitOrderInput ? '' : 'hidden'} type="number" placeholder="Price to buy or sell at..."/>
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
        let buyTrades = this.props.trades.filter(trade => trade.type == 'buy')
        buyTrades = buyTrades.map((trade, index) => (
            <div key={trade.id + index} className="trade-container buy-trade">
                <div className="trade-symbol">{trade.firstSymbol}</div>
                <div className="trade-symbol">{trade.secondSymbol}</div>
                <div className="trade-pricing">{trade.type} {trade.quantity} {trade.firstSymbol} at {trade.price} {trade.secondSymbol} each</div>
            </div>
        ))
        let sellTrades = this.props.trades.filter(trade => trade.type == 'sell')
        sellTrades = sellTrades.map((trade, index) => (
            <div key={trade.id + index} className="trade-container sell-trade">
                <div className="trade-symbol">{trade.firstSymbol}</div>
                <div className="trade-symbol">{trade.secondSymbol}</div>
                <div className="trade-pricing">{trade.type} {trade.quantity} {trade.firstSymbol} at {trade.price} {trade.secondSymbol} each</div>
            </div>
        ))
        return (
            <div className="trades">
                <div className="buy-trades-title">Buy</div>
                <div className="buy-trades-container">{buyTrades}</div>
                <div className="sell-trades-title">Sell</div>
                <div className="sell-trades-container">{sellTrades}</div>
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
        const historicalTrades = this.props.history.map((trade, index) => (
            <div key={trade.id + index} className="historical-trade">
                <div>{trade.type} {trade.quantity} {trade.firstSymbol} for {trade.quantity * trade.price} {trade.secondSymbol} at {trade.price} each</div>
            </div>
        ))
        return (
            <div>
                <div>Recent history</div>
                {historicalTrades}
            </div>
        )
    }
}

ReactDOM.render(<Main />, document.querySelector('#root'))
