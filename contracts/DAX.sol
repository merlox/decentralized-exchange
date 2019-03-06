// We need a system that allows people to trade different pairs of ERC20 tokens. Only approved tokens will be tradable since we don't want to clutter the system with an endless list of unused tokens. As a proof of concept, we'll trade only ETH - HYDRO since hydro is a famous ERC20 token that has a test token available outside the mainnet in rinkeby.

// Functions that we need:
/*
    1. Constructor to setup the owner
    2. Fallback non-payable function to reject ETH from direct transfers since we only want people to use the functions designed to trade a specific pair
    3. Function to extract tokens from this contract in case someone mistakenly sends ERC20 to the wrong function
    4. Function to create whitelist a token by the owner
    5. Function to create market orders
    6. Function to create limit orders
 */

pragma solidity ^0.5.4;

import './Escrow.sol';

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function totalSupply() external view returns (uint256);
    function balanceOf(address who) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract DAX {
    enum OrderState = {OPEN, CLOSED};

    struct Order {
        uint256 id;
        bytes32 type;
        bytes32 firstSymbol;
        bytes32 secondSymbol;
        uint256 quantity;
        uint256 price;
        uint256 timestamp;
        TradeState state;
    }

    Order[] public buyOrders;
    Order[] public sellOrders;
    Order[] public closedOrders;
    uint256 public orderIdCounter;
    address public owner;
    address[] public whitelistedTokens;
    bytes32[] public whitelistedTokenSymbols;
    address[] payable public users;

    // Token address => isWhitelisted or not
    mapping(address => bool) public isTokenWhitelisted;
    mapping(bytes32 => bool) public isTokenSymbolWhitelisted;
    mapping(bytes32[2] => bool) public isPairValid; // A token symbol pair made of ['FIRST', 'SECOND'] => doesExist or not
    mapping(bytes32 => address) public tokenAddressBySymbol; // Symbol => address of the token
    mapping(bytes32 => uint256) public marketPriceBuyOrderId; // Symbol name => lowest price buy Id
    mapping(bytes32 => uint256) public marketPriceSellOrderId; // Symbol name => highest price sell Id
    mapping(uint256 => Order) public orderById; // Id => trade object
    mapping(address => address) public escrowByUserAddress; // User address => escrow contract address

    modifier onlyOwner {
        require(msg.sender == owner, 'The sender must be the owner for this function');
        _;
    }

    /// @notice Users should sent ether to this contract to increase their balance
    function () external payable {
        depositEther();
    }

    constructor () public {
        owner = msg.sender;
    }

    /// @notice To store tokens inside the escrow contract associated with the user accounts as long as the users made an approval beforehand
    /// @dev It will revert is the user doesn't approve tokens beforehand to this contract
    /// @param _token The token address
    /// @param _amount The quantity to deposit to the escrow contracc
    function depositTokens(address _token, uint256 _amount) public {
        require(_token != address(0), 'You must specify the token address');
        require(_amount > 0, 'You must send some tokens with this deposit function');
        require(IERC20(_token).allowance(msg.sender, address(this)) >= _amount, 'You must approve() the quantity of tokens that you want to deposit first');
        if(escrowByUserAddress[msg.sender] == address(0)) {
            Escrow newEscrow = new Escrow(address(this));
            escrowByUserAddress[msg.sender] = address(newEscrow);
            users.push(msg.sender);
        }
        IERC20(_token).transfer(escrowByUserAddress[msg.sender], msg.value);
    }

    /// @notice To store ether in the escrow contract associated with the user
    function depositEther() public payable {
        require(msg.value > 0, 'You must set some ether when depositing with this function');
        if(escrowByUserAddress[msg.sender] == address(0)) {
            Escrow newEscrow = new Escrow(address(this));
            escrowByUserAddress[msg.sender] = address(newEscrow);
            users.push(msg.sender);
        }
        escrowByUserAddress[msg.sender].transfer(msg.value);
    }

    /// @notice To whitelist a token so that is tradable in the exchange
    /// @dev If the transaction reverts, it could be because of the quantity of token pairs, try reducing the number and breaking the transaction into several pieces
    /// @param _symbol The symbol of the token
    /// @param _token The token to whitelist
    /// @param _tokenPair The token pairs to whitelist for this new token, for instance: ['ETH', 'BAT', 'HYDRO'] which will be converted to ['NEW', 'ETH'], ['NEW', 'BAT'] and ['NEW', 'HYDRO']
    function whitelistToken(bytes32 _symbol, address _token, bytes32[] memory _tokenPairs) public onlyOwner {
        require(_token != address(0), 'You must specify the token address to whitelist');
        require(IERC20(_token).totalSupply() > 0, 'The token address specified is not a valid ERC20 token');

        // Only whitelist those that are new, otherwise just continue adding token pairs below
        if(!isTokenWhitelisted[_token]) {
            isTokenWhitelisted[_token] = true;
            isTokenSymbolWhitelisted[_symbol] = true;
            whitelistedTokens.push(_token);
            whitelistedTokenSymbols.push(_symbol);
            tokenAddressBySymbol[_symbol] = _token;
        }

        // Add all the new token pairs if it's already existing
        for(uint256 i = 0; i < _tokenPairs.length; i++) {
            bytes32[2] memory currentPair = [_symbol, _tokenPairs[i]];
            isPairValid[currentPair] = true;
        }
    }

    /// @notice To create a market order at the most profitable price given a token pair, type of order (buy or sell) and the amount of tokens to trade, the _quantity is how many _firstSymbol tokens you want to buy if it's a buy order or how many _firstSymbol tokens you want to sell at market price
    function marketOrder(bytes32 _type, bytes32 _firstSymbol, bytes32 _secondSymbol, uint256 _quantity) public {
        
    }

    /// @notice To create a market order given a token pair, type of order, amount of tokens to trade and the price per token. If the type is buy, the price will determine how many _secondSymbol tokens you are willing to pay for each _firstSymbol up until your _quantity or better if there are more profitable prices. If the type if sell, the price will determine how many _secondSymbol tokens you get for each _firstSymbol
    function limitOrder(bytes32 _type, bytes32 _firstSymbol, bytes32 _secondSymbol, uint256 _quantity, uint256 _pricePerToken) public {
        address userEscrow = escrowByUserAddress[msg.sender];
        address firstSymbolAddress = tokenAddressBySymbol[_firstSymbol];
        address secondSymbolAddress = tokenAddressBySymbol[_secondSymbol];

        require(firstSymbolAddress != address(0), 'The first symbol is an invalid token address');
        require(secondSymbolAddress != address(0), 'The second symbol is an invalid token address');
        require(isTokenSymbolWhitelisted[_firstSymbol], 'The first symbol must be whitelisted to trade with it');
        require(isTokenSymbolWhitelisted[_secondSymbol], 'The second symbol must be whitelisted to trade with it');
        require(userEscrow != address(0), 'You must deposit some tokens before creating orders, use depositToken()');

        Order myOrder = Order(tradeIdCounter, _type, _firstSymbol, _secondSymbol, _quantity, _pricePerToken, now, OrderState.OPEN);
        if(_type == 'buy') {
            // Check that the user has enough of the second symbol if he wants to buy the first symbol at that price
            require(IERC20(secondSymbolAddress).balanceOf(userEscrow) >= (_quantity * _pricePerToken), 'You must have enough second token funds in your escrow contract to create this buy order');

            buyOrders.push(myOrder);

            // If this order is more profitable to the sellers than the current market order, update it
            Order currentBuyMarketOrder = orderById[marketPriceBuyOrderId[_firstSymbol]];
            if(currentBuyMarketOrder.price > _pricePerToken) {
                marketPriceBuyOrderId[_firstSymbol] = orderIdCounter;
            }
        } else {
            // Check that the user has enough of the first symbol if he wants to sell it for the second symbol
            require(IERC20(firstSymbolAddress).balanceOf(userEscrow) >= (_quantity * _pricePerToken), 'You must have enough first token funds in your escrow contract to create this sell order');

            sellOrders.push(myOrder);

            // If this order is more profitable to the buyers than the current market order, update it
            Order currentSellMarketOrder = orderById[marketPriceSellOrderId[_firstSymbol]];
            if(currentSellMarketOrder.price > _pricePerToken) {
                marketPriceSellOrderId[_firstSymbol] = orderIdCounter;
            }
        }
        orderById[orderIdCounter] = myOrder;
        orderIdCounter += 1;
    }

    /// @notice To buy or sell an existing order to fill it at the price set by the order
    function fillOrder() public {

    }

    /// @notice To extract missing tokens from users that executed the wrong transfer function to this contract by transferring the tokens to the owner to manage it
    /// @param _token The token address to extract
    function extractToken(address _token) public onlyOwner {
        IERC20 token = IERC20(_token);
        token.transfer(owner, token.balanceOf(address(this)));
    }
}
