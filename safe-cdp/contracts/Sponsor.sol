// originally written by brandon
pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract Sponsor is Ownable{
  using SafeMath for uint;

  event newDeposit(address sponsor, uint depositAmount);
  event newWithdrawPrincipal(address sponsor, uint withdrawAmount);
  event newWithdrawInterest(address sponsor, uint withdrawAmount);
  event debtReturnedToPool(address fromCDP, uint totalAmount);


  mapping (address => uint) public sponsorDepositBalance;
  mapping (address => uint32) public readyTime;
  //mapping (address => bool) public isReady;

  uint totalPrinciple;
  uint totalInterest;
  uint coolDownTime = 3 days;
  uint8 public constant decimals = 18;
  //_tokens * (10 ** uint256(decimals))

  address tokenContractAddress;
  DaiToken contractToken;

  constructor(address _token) public {
    tokenContractAddress = _token;
    contractToken = DaiToken(tokenContractAddress);
  }

  //Sponsor Contract Address: 0xbbf289d846208c16edc8474705c748aff07732db
  //My Address: 0xca35b7d915458ef540ade6068dfe2f44e8fa733c
  //1000000000000000000000000


  modifier onlySafeCDP() {
    //require(safeCDPSet? == True);
    _;
  }

  //Sponsor deposits funds into the pool
  function deposit(uint _depositAmount) public {
    //uint tokenAllowanceAmount = tokenAllowance(msg.sender, address(this));
    //require(tokenAllowanceAmount >= _depositAmount);
    tokenTransferFrom(msg.sender,address(this), _depositAmount);
    totalPrinciple = totalPrinciple.add(_depositAmount);
    sponsorDepositBalance[msg.sender] = sponsorDepositBalance[msg.sender].add(_depositAmount);
    emit newDeposit(msg.sender, _depositAmount);
    readyTime[msg.sender] = uint32(now + coolDownTime);
  }

  function balanceOfContract() view external onlyOwner returns (uint) {
    return address(this).balance;
  }
  function _isReady() internal view returns (bool) {
      return (readyTime[msg.sender] <= now);
  }


  //Sponsor withdraws the amount
  function withdraw() public {
    //CAUTION => Example: 100 = totalInterest, from 10000 pool, sponsor deposited 1000
    //100*1000/10000 = 10
    //Sponsor can withdraw 1010
    //After withdraw => totalInterest = 90, Pool = 9000, sponsor deposited = 0;
    //Deposits again 1000 => totalInterest = 90, Pool = 10000, sponsor deposited = 1000;
    //Withraws agains => 90*1000/10000 = 9
    require(sponsorDepositBalance[msg.sender] > 0);
    require(_isReady());
    uint interest = totalInterest * (sponsorDepositBalance[msg.sender] / totalPrinciple);
    uint totalWithdraw = interest + sponsorDepositBalance[msg.sender];
    uint contractBalance = contractToken.balanceOf(this);
    require(contractBalance.sub(totalWithdraw)>=0);
    sponsorDepositBalance[msg.sender] = 0;
    totalPrinciple = totalPrinciple.sub(sponsorDepositBalance[msg.sender]);
    totalInterest = totalInterest.sub(interest);
    tokenTransfer(msg.sender,totalWithdraw);
    emit newWithdrawPrincipal(msg.sender, sponsorDepositBalance[msg.sender]);
    emit newWithdrawInterest(msg.sender, interest);
  }

  //Keeper Allowance
  function approvePayment(uint _approvePaymentAmount) public onlySafeCDP {
    tokenApprove(msg.sender,100000000000000000000000);
  }

  function returnDebt(uint _principalAmount, uint _interestAmount) public onlySafeCDP {
    uint totalPayment = _principalAmount + _interestAmount;
    tokenTransferFrom(msg.sender,address(this),totalPayment);
    totalPrinciple = totalPrinciple.add(_principalAmount);
    totalInterest = totalInterest.add(_interestAmount);
    emit debtReturnedToPool(msg.sender, totalPayment);
  }

  function changeCoolDownTime(uint _newCoolDownTime) public onlyOwner {
      coolDownTime = _newCoolDownTime;
  }

  function checkUserTokenBalance() public view returns(uint256){return contractToken.balanceOf(msg.sender);}
  function checkContractTokenBalance() public view returns(uint256){return contractToken.balanceOf(this);}
  function tokenAllowance(address _owner, address _spender) public view returns(uint){return contractToken.allowance(_owner, _spender);}
  function tokenTransferFrom(address _from, address _to, uint256 _value) public returns(bool){contractToken.transferFrom(_from, _to, _value);}
  function tokenTransfer(address _to, uint256 _amount) public onlySafeCDP returns(bool){contractToken.transfer(_to, _amount);}
  function tokenApprove(address _to, uint256 _amount) public onlySafeCDP returns(bool){contractToken.approve(_to, _amount);}

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