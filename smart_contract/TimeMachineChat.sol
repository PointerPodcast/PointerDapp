pragma solidity >=0.4.22 <0.7.0;

import "./Group.sol";

contract TimeMachineChat is ITimeMachineChat{

  //The indexed keyword will allow you to search these events using the indexed parameter as a filter
  event Thanks(address indexed from, uint amount);

  //New user signup
  event Registered(bytes32 username);

  //A new group has been created -event
  event NewGroup(address groupAddress, bytes32 groupName);

  //A group has been deleted -event
  event GroupDeleted(address groupAddress, bytes32 groupName);

  //owner is an address. The keyword "payable" means that owner can receive ether. 
  address payable owner; 

  //Map an address to a bytes32 (i.e. a readable name)
  mapping(address => bytes32) addressToUsername;

  //Needed for sendDonation(bytes32 _username) in Group
  mapping(bytes32 => address) usernameToAddress;


  //Storage Array of groups
  IGroup[] groups;
  
  //Avoid duplicate group
  mapping(bytes32 => bool) existGroup;

  //Constructor
  constructor() public{
    owner = msg.sender; //Contract "owner".
  }

  //A modifier is used to automatically check a condition prior to executing a function
  modifier onlyOwner{
    require(msg.sender == owner, "Only owner can call this function");
    _;
  }

  //check whether msg.sender is already registered
  modifier addressAlreadyRegistered(){
    require(addressToUsername[msg.sender] == bytes32(0x0), "Address already registered");
    _;
  }

  //check that "username" is not already taken
  modifier usernameTaken(bytes32 _username){
    require(usernameToAddress[_username] == address(0x0), "Username not available");
    _;
  }

  modifier isRegistered(){
    require(addressToUsername[tx.origin] != bytes32(0x0), "Address is not registered");//qui ci stava origin
    _;
  }

  modifier groupAlreadyExists(bytes32 _groupName){
    require(!existGroup[_groupName], "Group Name already exists");
    _;
  }

  //What does it means _ before the variable? Actually is sugar syntax, a convention to indicate that the variable _username is a function parameter
  function setUsername(bytes32 _username) external addressAlreadyRegistered usernameTaken(_username) override{
    addressToUsername[msg.sender] = _username; 
    usernameToAddress[_username] = msg.sender;
    emit Registered(_username);
  }
 
  //Get Your username
  //Is a view function. This means that is free. What happens if you mark as view a function which modify the smart contract's storage?
  function getUsername() external view override returns(bytes32){ //returns syntax
    return addressToUsername[tx.origin]; //tx.origin and not msg.sender 
  }

  function getAddress(bytes32 _username) external view isRegistered() override returns(address){
    return usernameToAddress[_username];
  }

  //Enable navigation in groups even if the address is not registered
  function getGroups() external view override returns(IGroup[] memory){
    return groups;
  }

  //What does it means keyword memory?
  //Iterate over an array costs. Theoretically, groups could contain many groups.
  //-> Tradeoff: I need an array of groups, so I use an uint which identify the position of a group inside the array. When you remove an array element, that position will be empty.  //To avoid useless waste of storage, we have to shift groups inside the array. Are you serious? Joking.
  //You have to switch the last group with the empty position. That's why we need to store the position of the deleted group.
  function createGroup(bytes32 _groupName) external override isRegistered() groupAlreadyExists(_groupName){
    Group g = new Group(msg.sender, _groupName, groups.length); 
    groups.push(g);
    existGroup[_groupName] = true;
    emit NewGroup(address(g),_groupName);
  }


  function deleteGroup() external override{
    uint pos = IGroup(msg.sender).getPosition();
    address groupAddress = address(groups[pos]);
    require(groupAddress == msg.sender); //Checks that the sender is the groups itself, otherwise, anyone could delete a group, even if this address is not the group's admin 
    bytes32 groupName = groups[pos].getGroupName();
    delete groups[pos];
    existGroup[groupName] = false;
    if(pos < groups.length - 1){
        IGroup lastGroup = groups[groups.length - 1];
        groups[pos] = lastGroup; //swap
        lastGroup.updatePosition(pos); //update lastGroup position
    }
    groups.pop(); //delete the last element
    emit GroupDeleted(groupAddress, groupName); 
  }

  //Donate some value to this smartcontract
  function sayThanks() external payable override isRegistered(){
    require(msg.value > 0);
    emit Thanks(msg.sender, msg.value);
  }


  //This function "delete" the contract.
  //After calling closeContract, functions will no longer be callable.
  //Since onlyOwner is present, only the owner of the contract can invoke this function.
  //selfdestruct(owner) means: closing the contract, all funds received from the "TimeMachineChat" contract will be sent to owner.
  function closeContract() external override onlyOwner{ 
    selfdestruct(owner); 
  }

}

