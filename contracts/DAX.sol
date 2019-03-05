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
    address public owner;
    address[] public whitelistedTokens;
    bytes32[] public whitelistedTokenSymbols;

    // Token address => isWhitelisted or not
    mapping(address => bool) public isTokenWhitelisted;

    // A token symbol => an array of tradable tokens for it. For instance: ETH => [BAT, HYDRO, EXP].
    mapping(bytes32 => bytes32[]) public tokenPairs;

    modifier onlyOwner {
        require(msg.sender == owner, 'The sender must be the owner for this function');
        _;
    }

    function () public {
        revert();
    }

    constructor () public {
        owner = msg.sender;
    }

    /// @notice To whitelist a token so that is tradable in the exchange
    /// @param _token The token to whitelist
    /// @param _tokenPair The token pairs to whitelist for this new token
    function whitelistToken(address _token, bytes32[][] _tokenPairs) public onlyOwner {}

    /// @notice To create a market order at the most profitable price given a token pair, type of order (buy or sell) and the amount of tokens to trade
    function marketOrder(bytes32 _type, bytes32 _firstSymbol, bytes32 _secondSymbol, uint256 _quantity) public {}

    /// @notice To create a market order given a token pair, type of order, amount of tokens to trade and the price per token. If the type is buy, the price will determine how many _secondSymbol tokens you are willing to pay for each _firstSymbol up until your _quantity or better if there are more profitable prices. If the type if sell, the price will determine how many _secondSymbol tokens you get for each _firstSymbol
    function limitOrder(bytes32 _type, bytes32 _firstSymbol, bytes32 _secondSymbol, uint256 _quantity, uint256 _pricePerToken) public {}

    /// @notice To extract missing tokens from users that executed the wrong transfer function to this contract by transferring the tokens to the owner to manage it
    /// @param _token The token address to extract
    function extractToken(address _token) public onlyOwner {
        IERC20 token = IERC20(_token);
        token.transfer(owner, token.balance(address(this)));
    }
}
