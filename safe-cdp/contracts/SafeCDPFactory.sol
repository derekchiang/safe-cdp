pragma solidity ^0.4.24;

// It's dumb that we are using both SafeMath and DSMath but I don't have
// time to fix it.
import "./DSMath.sol";
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract PepInterface {
    function peek() public returns (bytes32, bool);
}

contract TokenInterface {
    function allowance(address, address) public view returns (uint);
    function balanceOf(address) public view returns (uint);
    function approve(address, uint) public;
    function transfer(address, uint) public returns (bool);
    function transferFrom(address, address, uint) public returns (bool);
    function deposit() public payable;
    function withdraw(uint) public;
    function burn(address, uint) public;
}

contract VoxInterface {
    function par() public returns (uint);
}

contract TubInterface {
    VoxInterface public vox;  // Target price feed
    function open() public returns (bytes32);
    function join(uint) public;
    function exit(uint) public;
    function lock(bytes32, uint) public;
    function free(bytes32, uint) public;
    function draw(bytes32, uint) public;
    function wipe(bytes32, uint) public;
    function give(bytes32, address) public;
    function shut(bytes32) public;
    function cups(bytes32) public view returns (address, uint, uint, uint);
    function gem() public view returns (TokenInterface);
    function gov() public view returns (TokenInterface);
    function skr() public view returns (TokenInterface);
    function sai() public view returns (TokenInterface);
    function mat() public view returns (uint);
    function ink(bytes32) public view returns (uint);
    function tab(bytes32) public view returns (uint);
    function rap(bytes32) public view returns (uint);
    function per() public view returns (uint);
    function pep() public view returns (PepInterface);
    function tag() public view returns (uint wad);
}

contract SponsorPoolInterface {
    function approvePayment(uint amount) public;
    function returnDebt(uint principal, uint interest) public;
}

contract SafeCDPFactory {
    // Map from user address to the Safe CDPs they own
    mapping(address => address[]) public userToSafeCDPs;
    // A set of all Safe CDPs ever created
    mapping(address => bool) public safeCDPSet;
    // Safe CDP List
    bytes32[] public safeCDPs;

    function getSafeCDPs() external view returns (bytes32[]) {
        return safeCDPs;
    }

    address tubAddr;
    address daiAddr;
    address sponsorPoolAddr;

    constructor(address _tubAddr, address _daiAddr, address _sponsorPoolAddr) public {
        tubAddr = _tubAddr;
        daiAddr = _daiAddr;
        sponsorPoolAddr = _sponsorPoolAddr;
    }

    // targetCollateralization: the collateralization ratio that keepers
    // should keep the CDP at. E.g. 200.
    //
    // marginCallThreshold: the collateralization ratio at which the CDP
    // is deemed unsafe. E.g. 180.
    //
    // marginCallDuration: the amount of time the owner has to respond to
    // a margin call. E.g. 72 hours.
    //
    // rewardForKeeper: the percentage of debt used to reward keepers and
    // sponsors for their service. E.g. 10
    function createSafeCDP(
        address _proxy,
        bytes32 _cup,
        uint _targetCollateralization,
        uint _marginCallThreshold,
        uint _marginCallDuration,
        uint _rewardForKeeper) public returns (address) {
        SafeCDP cdp = new SafeCDP(
            msg.sender,
            _proxy,
            tubAddr,
            daiAddr,
            sponsorPoolAddr,
            _cup,
            _targetCollateralization,
            _marginCallThreshold,
            _marginCallDuration,
            _rewardForKeeper);
        userToSafeCDPs[msg.sender].push(address(cdp));
        safeCDPSet[address(cdp)] = true;
        safeCDPs.push(_cup);
        return cdp;
    }
}

contract SafeCDP is DSMath {

    using SafeMath for uint;

    struct MarginCall {
        uint id;
        address keeper;
        // The amount that the keeper has paid
        uint amount;
        // The time when the payment was made
        uint time;
    }

    event MarginCallInvoked(uint id, address keeper, uint amount, uint time);
    event MarginCallsResponded(uint[] marginCallIDs);

    address public owner;
    address public proxy;
    // tub is the global cdp record store
    // https://github.com/makerdao/sai/blob/master/DEVELOPING.md
    TubInterface tub;
    TokenInterface dai;
    SponsorPoolInterface sponsorPool;

    bytes32 public cup;

    // The unit of target collateralization and margin call threshold is the
    // same as the unit for liquidation ratio in the SAI contracts, which are
    // all denominated by RAY:
    // https://github.com/makerdao/dai.js/blob/7d20ed9d64e1add128f4fa39b76c72ac4489c34d/src/utils/constants.js#L5
    uint public targetCollateralization;
    uint public marginCallThreshold;

    // The amount of time the owner has to respond to a margin call before
    // penalty starts accuring and the keeper starts being able to withdraw
    // collaterals.
    uint public marginCallDuration;
    // The reward that the keeper gets to earn, as a percentage of the debt
    // that the keeper paid.  For instance if it's 10, the reward is 10%.
    uint public rewardForKeeper;

    // A list of margin calls that have been invoked but not cleared.
    MarginCall[] public marginCalls;
    uint public marginCallNonce;

    // Mapping from keeper address to the amount of DAI they can claim from
    // the amount of debt that the owner has paid.
    mapping(address => uint) public owedToKeeper;

    constructor(
        address _owner,
        address _proxy,
        address _tubAddr,
        address _daiAddr,
        address _sponsorPoolAddr,
        bytes32 _cup,
        uint _targetCollateralization,
        uint _marginCallThreshold,
        uint _marginCallDuration,
        uint _rewardForKeeper) public {

        owner = _owner;
        proxy = _proxy;
        tub = TubInterface(_tubAddr);
        dai = TokenInterface(_daiAddr);
        sponsorPool = SponsorPoolInterface(_sponsorPoolAddr);
        cup = _cup;
        targetCollateralization = _targetCollateralization;
        marginCallThreshold = _marginCallThreshold;
        marginCallDuration = _marginCallDuration;
        rewardForKeeper = _rewardForKeeper;
    }

    function marginCall() public returns (uint) {
        require(!safe(), "Current collateralization is not below the margin call threshold.");

        uint debtToPay = diffWithTargetCollateral();
        sponsorPool.approvePayment(debtToPay);
        dai.transferFrom(sponsorPool, this, debtToPay);
        dai.approve(tub, debtToPay);
        tub.wipe(cup, debtToPay);

        MarginCall memory mc = MarginCall(marginCallNonce, msg.sender, debtToPay, now);
        marginCalls.push(mc);
        emit MarginCallInvoked(mc.id, mc.keeper, mc.amount, mc.time);
        marginCallNonce = marginCallNonce.add(1);
        return mc.id;
    }

    function withdrawOwedCollateral() public pure {
        // TODO
    }

    // Pay debt to keepers in response to margin calls.
    //
    // Although only the owner has any reason to pay debt, there seems to be
    // no harm in allowing anyone to pay debt, similar to how anyone can wipe
    // any CDP's debt.
    //
    // TODO: Right now we are paying all debt.  Would it make sense to pay
    // partial debt?
    function respondToMarginCalls() public {
        uint totalPrincipal = 0;
        uint totalInterest = 0;
        uint totalInterestForPool = 0;
        for (uint i = 0; i < marginCalls.length; i++) {
            address keeper = marginCalls[i].keeper;
            uint principal = marginCalls[i].amount;
            uint interest = computeInterest(i);

            uint interestForKeeper = interest.div(2);
            uint interestForPool = interest.sub(interestForKeeper);

            owedToKeeper[keeper] = owedToKeeper[keeper].add(interestForKeeper);
            // TODO: we shouldn't actually transfer here because the keeper
            // may be a smart contract and this can be a security flaw.
            // Rather we should just approve() and let the keeper claim the
            // reward.
            // However we didn't have time to implement the logic for the keeper
            // to claim rewards, so we are doing this for now.
            dai.transfer(keeper, owedToKeeper[keeper]);

            totalPrincipal = totalPrincipal.add(principal);
            totalInterest = totalInterest.add(interest);
            totalInterestForPool = totalInterestForPool.add(interestForPool);
        }

        // Clear margin calls
        delete marginCalls;

        uint totalForPool = totalPrincipal.add(totalInterestForPool);
        // Transfer tokens to self
        dai.transferFrom(msg.sender, this, totalPrincipal.add(totalInterest));
        // Approve tokens for the pool and initiate the transfer
        dai.approve(sponsorPool, totalForPool);
        sponsorPool.returnDebt(totalPrincipal, totalInterestForPool);
    }

    // The total amount of debt that the user currently owes to keepers.
    // In other words, this is the amount that needs to be approved for
    // transfer before the owner calls respondToMarginCalls.
    function totalAccuredDebt() public view returns (uint) {
        uint total = 0;
        for (uint i = 0; i < marginCalls.length; i++) {
            uint principal = marginCalls[i].amount;
            uint interest = computeInterest(i);
            total = total.add(principal.add(interest));
        }
        return total;
    }

    function computeInterest(uint _mc) public view returns (uint) {
        MarginCall storage mc = marginCalls[_mc];
        uint interest;
        if (now < mc.time.add(marginCallDuration)) {
            // This is the case if the owner responds to the margin call in time
            // div by 100 because rewardForKeeper is a percentage.
            interest = mc.amount.mul(rewardForKeeper).div(100);
        } else {
            // If the owner responds after the marginCallDuration has passed,
            // additional interest will start accuring.
            interest = mc.amount.mul(rewardForKeeper).div(100).mul(now.sub(mc.time).div(marginCallDuration));
        }
        return interest;
    }

    // Returns whether the collateralization is above the margin call ratio.
    // Adopted from: https://github.com/makerdao/sai/blob/0dd0a799e4746ac1955b67898762cff9b71aea17/src/tub.sol#L241
    function safe() public returns (bool) {
        uint pro = rmul(tub.tag(), tub.ink(cup));
        uint con = rmul(tub.vox().par(), tub.tab(cup));
        uint min = rmul(con, marginCallThreshold);
        return pro >= min;
    }

    // The difference between the total amount of collateral right now,
    function diffWithTargetCollateral() public returns (uint) {
        uint con = rmul(tub.vox().par(), wadToRay(tub.tab(cup)));
        uint pro = rmul(tub.tag(), wadToRay(tub.ink(cup)));
        // TODO: is this actually the right unit to use??  You wound up
        // with a ray number, but what you want is a DAI token count
        return rayToWad(con.sub(rdiv(pro, targetCollateralization)));
    }

    function wadToRay(uint wad) public pure returns (uint) {
        return wad * (RAY/WAD);
    }

    function rayToWad(uint ray) public pure returns (uint) {
        return ray / (RAY/WAD);
    }

    // Give the CDP back to the original owner
    function relinquish() public {
        require(msg.sender == owner, "Only owner can relinquish CDP");
        require(totalAccuredDebt() == 0, "Cannot relinquishi CDP until all debt has been accounted for.");
        // We wanna return the CDP to the proxy.
        tub.give(cup, proxy);
        selfdestruct(owner);
    }

}