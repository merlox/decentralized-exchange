import React from 'react'
import ReactDOM from 'react-dom'
import MyWeb3 from 'web3'
import './index.styl'
import ABI from '../build/contracts/DAX.json'
import TokenABI from '../build/contracts/ERC20.json'

const batToken = '0x850Cbb38828adF8a89d7d799CCf1010Dc238F665'
const watToken = '0x029cc401Ef45B2a2B2D6D2D6677b9F94E26cfF9d'

class Main extends React.Component {
    constructor() {
        super()

        this.state = {
            contractInstance: {},
            tokenInstance: {},
            secondTokenInstance: {},
            userAddress: '',
            firstSymbol: 'BAT', // Sample tokens
            secondSymbol: 'WAT', // Sample tokens
            balanceFirstSymbol: 0,
            balanceSecondSymbol: 0,
            escrow: '',
            buyOrders: [],
            sellOrders: [],
            closedOrders: []
        }

        this.setup()
    }

    // To use bytes32 functions
    bytes32(name) {
        return myWeb3.utils.fromAscii(name)
    }

    async setup() {
        // Create the contract instance
        window.myWeb3 = new MyWeb3(ethereum)
        try {
            await ethereum.enable();
        } catch (error) {
            console.error('You must approve this dApp to interact with it')
        }
        console.log('Setting up contract instances')
        await this.setContractInstances()
        console.log('Setting up orders')
        await this.setOrders()
        console.log('Setting up pairs')
        await this.setPairs()
    }

    async setContractInstances() {
        const contractAddress = ABI.networks['3'].address
        const abi = ABI.abi
        const userAddress = (await myWeb3.eth.getAccounts())[0]
        if(!userAddress) return console.error('You must unlock metamask to use this dApp on ropsten!')
        await this.setState({userAddress})
        const contractInstance = new myWeb3.eth.Contract(abi, contractAddress, {
            from: this.state.userAddress,
            gasPrice: 2e9
        })
        const tokenAbi = TokenABI.abi
        const tokenInstance = new myWeb3.eth.Contract(abi, batToken, {
            from: this.state.userAddress,
            gasPrice: 2e9
        })
        const secondTokenInstance = new myWeb3.eth.Contract(abi, watToken, {
            from: this.state.userAddress,
            gasPrice: 2e9
        })
        await this.setState({contractInstance, tokenInstance, secondTokenInstance})
    }

    async setOrders() {
        // First get the length of all the orders so that you can loop through them
        const buyOrdersLength = await this.state.contractInstance.methods.getOrderLength(this.bytes32("buy")).call({ from: this.state.userAddress })
        const sellOrdersLength = await this.state.contractInstance.methods.getOrderLength(this.bytes32('sell')).call({ from: this.state.userAddress })
        const closedOrdersLength = await this.state.contractInstance.methods.getOrderLength(this.bytes32('closed')).call({ from: this.state.userAddress })
        let buyOrders = []
        let sellOrders = []
        let closedOrders = []

        for(let i = 0; i < buyOrdersLength; i++) {
            buyOrders.push(await this.state.contractInstance.methods.getOrder(this.bytes32('buy'), i).call({ from: this.state.userAddress }))
        }
        for(let i = 0; i < sellOrdersLength; i++) {
            sellOrders.push(await this.state.contractInstance.methods.sellOrders(this.bytes32('sell'), 0).call({ from: this.state.userAddress }))
        }
        for(let i = 0; i < closedOrdersLength; i++) {
            closedOrders.push(await this.state.contractInstance.methods.closedOrders(this.bytes32('close'), 0).call({ from: this.state.userAddress }))
        }

        this.setState({buyOrders, sellOrders, closedOrders})
    }

    async setPairs() {
        // Here you'd add all the logic to get all the token symbols, in this case we're keeping it simple with one fixed pair
        // If there are no pairs, whitelist a new one automatically if this is the owner of the DAX contract
        const owner = await this.state.contractInstance.methods.owner().call({ from: this.state.userAddress })
        if(owner == this.state.userAddress && !firstSymbol) {
            await this.state.contractInstance.methods.whitelistToken(this.bytes32('BAT'), batToken, [this.bytes32('WAT')], [watToken]).send({ from: this.state.userAddress, gas: 8e6 })
        }

        // Set the balance of each symbol considering how many tokens you have in escrow
        const escrow = await this.state.contractInstance.methods.escrowByUserAddress(this.state.userAddress).call({ from: this.state.userAddress })
        const balanceOne = await this.state.tokenInstance.methods.balanceOf(escrow).call({ from: this.state.userAddress })
        const balanceTwo = await this.state.secondTokenInstance.methods.balanceOf(escrow).call({ from: this.state.userAddress })
        this.setState({escrow, balanceOne, balanceTwo})
    }

    async whitelistTokens(symbol, token, pairSymbols, pairAddresses) {
        await this.state.contractInstance.methods.whitelistToken(this.bytes32(symbol), token, pairSymbols, pairAddresses).send({ from: this.state.userAddress })
    }

    async depositTokens(address, amount) {
        // Do the token allowance to the dax contract
        const result = await this.state.tokenInstance.methods.approve(this.state.contractInstance.address, amount).send({ from: this.state.userAddress })
        if(!result) return console.log('Error the approval wasn\'t successful')
        // Create the transaction
        await this.state.contractInstance.methoods.depositTokens(address, amount).send({ from: this.state.userAddress })
    }

    async extractTokens(address, amount) {
        await this.state.contractInstance.methods.extractTokens(address, amount).send({ from: this.state.userAddress })
    }

    async createLimitOrder(approvalQuantity, type, firstSymbol, secondSymbol, quantity, pricePerToken) {
        // Approve some tokens
        await this.state.tokenInstance.methods.approve(this.state.contractInstance.address, approvalQuantity).send({ from: this.state.userAddress })
        // Create the market order
        await this.state.contractInstance.methods.limitOrder(type, firstSymbol, secondSymbol, quantity, pricePerToken).send({ from: this.state.userAddress })
    }

    async createMarketOrder(approvalQuantity, type, firstSymbol, secondSymbol, quantity) {
        // Approve some tokens
        await this.state.tokenInstance.methods.approve(this.state.contractInstance.address, approvalQuantity).send({ from: this.state.userAddress })
        // Create the market order
        await this.state.contractInstance.methods.marketOrder(type, firstSymbol, secondSymbol, quantity).send({ from: this.state.userAddress })
    }

    render() {
        return (
            <div className="main-container">
                <Sidebar
                    firstSymbol={this.state.firstSymbol}
                    secondSymbol={this.state.secondSymbol}
                    balanceOne={this.state.balanceOne}
                    balanceTwo={this.state.balanceTwo}
                />
                <Orders
                    buyOrders={this.state.buyOrders}
                    sellOrders={this.state.sellOrders}
                />
                <History
                    closedOrders={this.state.closedOrders}
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
            showLimitOrderInput: false,
        }
    }


    render() {
        return (
            <div className="sidebar">
                <div className="selected-assets-title heading">Selected assets</div>
                <div className="selected-asset-one">{this.props.firstSymbol}</div>
                <div className="selected-asset-two">{this.props.secondSymbol}</div>
                <div className="your-portfolio heading">Your portfolio</div>
                <div className="grid-center">{this.props.firstSymbol}:</div><div className="grid-center">{this.props.balanceOne}</div>
                <div className="grid-center">{this.props.secondSymbol}:</div><div className="grid-center">{this.props.balanceTwo}</div>
                <div className="money-management heading">Money management</div>
                <button className="button-outline">Deposit</button>
                <button className="button-outline">Withdraw</button>
                <div className="actions heading">Actions</div>
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
class Orders extends React.Component {
    constructor() {
        super()
    }

    render() {
        let buyOrders = this.props.buyOrders
        let sellOrders = this.props.sellOrders
        if(buyOrders.length > 0) {
            buyOrders = buyOrders.map((trade, index) => (
                <div key={trade.id + index} className="trade-container buy-trade">
                    <div className="trade-symbol">{trade.firstSymbol}</div>
                    <div className="trade-symbol">{trade.secondSymbol}</div>
                    <div className="trade-pricing">{trade.type} {trade.quantity} {trade.firstSymbol} at {trade.price} {trade.secondSymbol} each</div>
                </div>
            ))
        }
        if(sellOrders.length > 0) {
            sellOrders = sellOrders.map((trade, index) => (
                <div key={trade.id + index} className="trade-container sell-trade">
                    <div className="trade-symbol">{trade.firstSymbol}</div>
                    <div className="trade-symbol">{trade.secondSymbol}</div>
                    <div className="trade-pricing">{trade.type} {trade.quantity} {trade.firstSymbol} at {trade.price} {trade.secondSymbol} each</div>
                </div>
            ))
        }
        return (
            <div className="trades">
                <div className="buy-trades-title heading">Buy</div>
                <div className="buy-trades-container">{buyOrders}</div>
                <div className="sell-trades-title heading">Sell</div>
                <div className="sell-trades-container">{sellOrders}</div>
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
        let closedOrders = this.props.closedOrders
        if(closedOrders.length > 0) {
            closedOrders = closedOrders.map((trade, index) => (
                <div key={trade.id + index} className="historical-trade">
                    <div className={trade.type == 'sell' ? 'sell-trade' : 'buy-trade'}>{trade.type} {trade.quantity} {trade.firstSymbol} for {trade.quantity * trade.price} {trade.secondSymbol} at {trade.price} each</div>
                </div>
            ))
        }
        return (
            <div className="history">
                <div className="heading">Recent history</div>
                <div className="historical-trades-container">{closedOrders}</div>
            </div>
        )
    }
}

ReactDOM.render(<Main />, document.querySelector('#root'))
