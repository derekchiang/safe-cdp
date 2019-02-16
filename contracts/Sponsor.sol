pragma solidity 0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol'
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Sponsor is Ownable{
  using SafeMath for uint;
  address safeCDPContractAddress;

  event newDeposit(address sponsor, uint depositAmount);
  event newWithdraw(address sponsor, uint withdrawAmount);

  mapping (address => uint) public sponsorDepositBalance;
  mapping (address => bool) public ;

  modifier onlySafeCDP() {
    require(safeCDPSet == True);
    _;
  }

  function changeSafeCDPAddress(address _newSafeCDPContractAddress) public onlyOwner{
    safeCDPContractAddress = _newSafeCDPContractAddress;
  }

  //Sponsor deposits funds into the pool
  function deposit(uint _depositAmount) {
    //require(tokenAllowance(msg.sender, this) = _depositAmount);
    require(msg.value == 0);
    transfer(this, _depositAmount);
    sponsorDepositBalance[msg.sender] = sponsorDepositBalance[msg.sender].add(_depositAmount);
    newDeposit(msg.sender, _depositAmount);
  }

  function balanceOfContract() view external onlyOwner returns (uint) {
    return address(this).balance;
  }
  //Sponsor withdraws the amount
  function withdraw(uint _withdrawAmount) {
    require(msg.value == 0);
    require(sponsorDepositBalance[msg.sender] >= _withdrawAmount);
    require(address(this).balance.sub(_withdrawAmount)>=0);
    sponsorDepositBalance[msg.sender] = sponsorDepositBalance[msg.sender].sub(_withdrawAmount);
    tokenTransfer(msg.sender,_withdrawAmount);
    newWithdraw(msg.sender, _withdrawAmount);
  }

  //Keeper Allowance
  function approvePayment(uint _approvePaymentAmount) public onlySafeCDP {
    require(msg.value == 0);
    approve(msg.sender,_approvePaymentAmount);

  }

  function returnDebt() public onlySafeCDP {
    require(msg.value == 0);

  }

  function checkUserTokenBalance() public view returns(uint256){return contractToken.balanceOf(msg.sender);}
  function checkContractTokenBalance() public view returns(uint256){return contractToken.balanceOf(this);}
  function tokenAllowance(address _owner, address _spender) public view returns(uint){return contractToken.allowance(_owner, _spender);}
  function tokenTransferFrom(address _from, address _to, uint256 _value) public returns(bool){contractToken.transferFrom(_from, _to, _value);}
  function tokenTransfer(address _to, uint256 _amount) public onlyOwner returns(bool){contractToken.transfer(_to, _amount);}

}

contract DaiToken {
    function totalSupply() public pure returns (uint);
    function balanceOf(address tokenOwner) public pure returns (uint balance);
    function transfer(address _to, uint _value) public returns (bool success);
    function allowance(address owner, address spender) public view returns (uint256);
    function transferFrom(address from, address to, uint256 value) public returns (bool);
    function approve(address spender, uint256 value) public returns (bool);
    event Approval(address indexed owner,address indexed spender,uint256 value);

    event Transfer(address indexed from, address indexed to, uint tokens);
}
